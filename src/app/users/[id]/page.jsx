'use client';
import useProfile from "@/components/UseProfile"
import UserTab from "@/components/layout/tabs";
import UserForm from "@/components/layout/UserForm";
import {useEffect, useState} from "react"
import {useParams} from "next/navigation"
import toast from "react-hot-toast"
export default function EditUserPage() {
    const {loading, data} = useProfile();
    const {id} = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/users?_id=${encodeURIComponent(id)}`)
        .then(res =>  res.json())
        .then(user => setUser(user))
    }, [id]);

    function handleSaveButtonClick(ev, formData) {
        ev.preventDefault();
        const promise = new Promise (async (resolve, reject) => {
            const res = await fetch('/api/profile', {
            method: 'PUT',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({...formData, _id: id}),
        });
        if (res.ok) 
            resolve();
        else
            reject();
        });
        toast.promise(promise, {
            loading: 'Saving user data...',
            success: 'User data saved!',
            error: 'Error when saving user data',
        });
    }
    if (loading) {
        return 'Loading user profile ...';
    }

    if (!data.isAdmin) {
        return 'Not an admin';
    }

    if (!user) {
        return 'Loading user data...';
    }

    return (
        <section className="mt-8 mx-auto max-w-2xl">
            <div className="mt-8">
                <UserForm user={user} onSave={handleSaveButtonClick} showAdmin={true} />
            </div>
        </section>
    );
}