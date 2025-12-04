//Thêm mới sản phẩm
'use client';
import UseProfile from "@/components/UseProfile"
import StoreForm from "@/components/layout/StoreForm"
import {useState, useEffect, useRef} from "react"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"
import Link from "next/link"
import Left from "@/components/icons/left"

export default function NewStorePage() {
    const {loading, data} = UseProfile();
    const [redirectToItems, setRedirectToItems] = useState(false);
    const {push, router} = useRouter();

    async function handleFormSubmit(ev, data) {
        ev.preventDefault();
        const savingPromise = new Promise(async(resolve, reject) => {
            const response = await fetch('/api/store', {
            method: 'POST',
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

    useEffect(() => {
        if (redirectToItems) {
            push('/store');
        }
    }, [redirectToItems, push]);

    const toastId = useRef(null);

    // Show loading toast only once
    useEffect(() => {
    if (loading && !toastId.current) {
        toastId.current = toast.loading("Loading store ...");
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
            <div className="mt-8">
                <Link href={'/store'} className="button">
                    <Left />
                    <span>Show all stores</span>
                </Link>
            </div>
            <StoreForm initialStore={null} onSubmit={handleFormSubmit}/>
        </section>
    );
}