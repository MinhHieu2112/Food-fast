'use client';
import UserTab from "@/components/layout/tabs";
import useProfile from "@/components/UseProfile"
import {useEffect, useState} from "react"
import Link from "next/link"

export default function UsersPage() {

    const {loading, data} = useProfile();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('/api/users').then(response => {
            response.json().then(users => {
                setUsers(users);
                });
            });
    }, []);

    if (loading) {
        return 'Loading user info';
    }

    if (!data.isAdmin) {
        return 'Not an admin';
    }

    return (
        <section className="max-w-2xl mx-auto mt-8">
            <UserTab isAdmin={true}/>
            <div className="mt-8">
                {users?.length > 0 && users.map(user => (
                    <div key={user._id} className="bg-gray-100 rounded-lg mb-2 p-1 px-4 flex items-center gap-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow text-sm">
                            <div className="text-gray-700">
                                {!!user.name && (<span>{user.name}</span>)}
                                {!user.name && (<span className="italic">No name</span>)}
                            </div>
                            <span className="text-gray-500">{user.email}</span>
                        </div>
                        <div>
                            <Link className="btn-register bg-white text-sm hover:bg-gray-200" href={'/users/'+user._id}>Edit</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}