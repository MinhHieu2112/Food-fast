// Sửa sản phẩm
'use client';
import { redirect } from 'next/navigation';
import UseProfile from "@/components/UseProfile"
import StoreForm from "@/components/layout/StoreForm"
import {useState, useEffect, useRef} from "react"
import toast from "react-hot-toast"
import Link from "next/link"
import Left from "@/components/icons/left"
import { useParams, useRouter } from 'next/navigation';
import DeleteButton from "@/components/DeleteButton"


export default function EditStorePage() {
    const {id} = useParams();
    const {loading, data} = UseProfile();
    const [redirectToItems, setRedirectToItems] = useState(false);
    const [store, setStore] = useState(null);
    const router = useRouter();

    useEffect(() => {
    if (!id) return; // chờ id có giá trị rồi mới chạy

    async function fetchData() {
        try {
            const res = await fetch('/api/store');
            const stores = await res.json();
            const store = stores.find(i => i._id.toString() === id.toString());

            if (!store) {
                console.warn("Not found for id:", id);
                return;
            }
            setStore(store);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }
        fetchData();
    }, [id]);
            

    async function handleFormSubmit(ev, data) {
        ev.preventDefault();
        data = {...data,_id: id };
        const savingPromise = new Promise(async(resolve, reject) => {
            const response = await fetch('/api/store', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type' : 'application/json' },
            });
            if(response.ok) 
                resolve();
            else 
                reject();
        });

        await toast.promise(savingPromise, {
            loading: 'Saving this store',
            success: 'Saved',
            error: 'Error',
        });
        setRedirectToItems(true);
    }
    
    async function handleDeleteClick() {
    const promise = new Promise(async (resolve, reject) => {
        const res = await fetch('/api/store?_id=' + id, {
            method: 'DELETE',
        });

        const data = await res.json();

        if (res.ok) {
            resolve();
        } else {
            // Trả lỗi thật vào toast
            reject(data.error || "Unknown error");
        }
    });

        toast.promise(promise, {
            loading: 'Deleting...',
            success: 'Deleted',
            error: (err) => err, // hiện đúng message từ API
        })
        .then(() => {
            // Chỉ redirect khi xóa thành công
            setRedirectToItems(true);
        })
        .catch(() => {
            // Không redirect khi lỗi
        });
    }


    if (redirectToItems) {
        return redirect('/store');
    }

    const toastId = useRef(null);

    // Show loading toast only once
    useEffect(() => {
    if (loading && !toastId.current) {
        toastId.current = toast.loading("Loading store info...");
    }
    if (!loading && toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
    }
    }, [loading]);

    // Allowed roles
    const allowed = ["admin"];

    // Handle unauthorized access
    useEffect(() => {
    if (!loading && data) {
        if (!allowed.includes(data.role)) {
        toast.error("You do not have access!");
        router.push("/");
        }
    }
    }, [loading, data, router]);

    // Avoid rendering until authorized
    if (loading) return null;
    if (!data || !allowed.includes(data.role)) return null;

    return (
        <section className="mt-8 max-w-2xl mx-auto">
            <div className="max-w-2xl mx-auto mt-8">
                <Link href={'/store'} className="button">
                    <Left />
                    <span>Show all stores</span>
                </Link>
            </div>
            <StoreForm initialStore={store} onSubmit={handleFormSubmit}/>
            <div className="max-w-2xl mx-auto mt-4">
                <DeleteButton label="Delete this store" onDelete={handleDeleteClick}/>
            </div>
        </section>
    );
}