'use client';
import useProfile from "@/components/UseProfile"
import UserTab from "@/components/layout/tabs";
import UserForm from "@/components/layout/UserForm";
import {useEffect, useState} from "react"
import {useParams} from "next/navigation"
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
        fetch('/api/profile', {
            method: 'PUT',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({...formData, _id: id}),
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
            <UserTab isAdmin={true}/>
            <div className="mt-8">
                <UserForm user={user} onSave={handleSaveButtonClick} />
            </div>
        </section>
    );
}