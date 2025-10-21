'use client';
import UserTabs from "@/components/layout/tabs"
import UseProfile from "@/components/UseProfile"
import MenuItemForm from "@/components/layout/MenuItemForm"
import {useState, useEffect} from "react"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"
import Link from "next/link"
import Left from "@/components/icons/left"

export default function NewMenuItemPage() {
    const {loading, data} = UseProfile();
    const [redirectToItems, setRedirectToItems] = useState(false);
    const {push} = useRouter();
    async function handleFormSubmit(ev, formData) {
        ev.preventDefault();
        const savingPromise = new Promise(async(resolve, reject) => {
            const response = await fetch('/api/menu-items', {
            method: 'POST',
            body: JSON.stringify(formData),
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

    useEffect(() => {
        if (redirectToItems) {
            push('/menu-items');
        }
    }, [redirectToItems, push]);

    if(loading) {
        return 'Loading user info ...'
    }

    if(!data.isAdmin) {
        return 'Not an admin';
    }

    return (
        <section className="mt-8">
            <UserTabs isAdmin={true} />
            <div className="mt-8 max-w-2xl mx-auto">
                <Link href={'/menu-items'} className="button">
                    <Left />
                    <span>Show all menu items</span>
                </Link>
            </div>
            <MenuItemForm menuItem={null} onSubmit={handleFormSubmit}/>
        </section>
    );
}