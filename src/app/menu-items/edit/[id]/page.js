'use client';
import { redirect } from 'next/navigation';
import UserTabs from "@/components/layout/tabs"
import UseProfile from "@/components/UseProfile"
import MenuItemForm from "@/components/layout/MenuItemForm"
import {useState, useEffect} from "react"
import toast from "react-hot-toast"
import Link from "next/link"
import Left from "@/components/icons/left"
import { useParams } from 'next/navigation';
import DeleteButton from "@/components/DeleteButton"


export default function EditMenuItemPage() {
    const {id} = useParams();
    const {loading, data} = UseProfile();
    const [redirectToItems, setRedirectToItems] = useState(false);
    const [menuItem, setMenuItem] = useState(null);
    useEffect(() => {
    if (!id) return; // chờ id có giá trị rồi mới chạy

    async function fetchData() {
        try {
            const res = await fetch('/api/menu-items');
            const items = await res.json();
            const item = items.find(i => i._id.toString() === id.toString());
            console.log("item:", item)
            if (!item) {
                console.warn("Item not found for id:", id);
                return;
            }
            setMenuItem(item);
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
            const response = await fetch('/api/menu-items', {
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
            loading: 'Saving this tasty item',
            success: 'Saved',
            error: 'Error',
        });

        setRedirectToItems(true);
    }
    
    async function handleDeleteClick() {
        const promise = new Promise(async (resolve, reject) => {
            const res = await fetch('/api/menu-items?_id=' + id, {
                method: 'DELETE',
            });
            if (res.ok) {
                resolve();
            } else {
                reject();
            }
        });
        toast.promise(promise, {
            loading: 'Deleting...',
            success: 'Deleted',
            error: 'Error, sorry...',
        });
        setRedirectToItems(true);
    }


    if (redirectToItems) {
        return redirect('/menu-items');
    }

    if(loading) {
        return 'Loading user info ...'
    }

    if(!data.isAdmin) {
        return 'Not an admin';
    }

    return (
        <section className="mt-8 max-w-2xl mx-auto">
            <UserTabs isAdmin={true} />
            <div className="max-w-2xl mx-auto mt-8">
                <Link href={'/menu-items'} className="button">
                    <Left />
                    <span>Show all menu items</span>
                </Link>
            </div>
            <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit}/>
            <div className="max-w-lg mx-auto mt-2">
                <div className="max-w-xs ml-auto pl-9.5">
                    <DeleteButton label="Delete this menu item" 
                                onDelete={handleDeleteClick}/>
                </div>
            </div>
        </section>
    );
}