'use client';
import useProfile from "@/components/UseProfile"
import UserForm from "@/components/layout/UserForm";
import {useEffect, useState} from "react"
import {useParams, useRef} from "next/navigation"
import toast from "react-hot-toast"
export default function EditUserPage() {
    const {loading, data} = useProfile();
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const toastId = useRef(null);

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
    // Show loading toast only once
    useEffect(() => {
    if (loading && !toastId.current) {
        toastId.current = toast.loading("Loading user info...");
    }
    if (!loading && toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
    }
    }, [loading]);

    // Allowed roles
    const allowed = ["admin", "manager"];

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
        <section className="mt-8 mx-auto max-w-2xl">
            <div className="mt-8">
                <UserForm user={user} onSave={handleSaveButtonClick} showAdmin={true} />
            </div>
        </section>
    );
}