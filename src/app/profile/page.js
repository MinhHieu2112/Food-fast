'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            alert('Please login!');
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.name) {
            setUserName(session.user.name);
        }
    }, [status, router, session]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return null; // đã chuyển hướng rồi
    }

    // session tồn tại
    const user = session.user;
    const userImage = user?.image || '/default-avatar.png';

    async function handleProfileInfoUpdate(ev) {
        ev.preventDefault();
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userName }),
        });

        const result = await response.json();

        if (result === true) {
            alert('Profile updated successfully!');
        } else {
            console.log("Response", result);
            alert('Something went wrong!');
        }
    }

    return (
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4">Profile</h1>
            <div className="max-w-md mx-auto">
                <div className="flex gap-4 items-center">
                    <div>
                        <div className="p-2 rounded-lg relative">
                            <Image
                                className="rounded-lg w-full h-full mb-4"
                                src={userImage}
                                width={250}
                                height={250}
                                alt="avatar"
                            />
                            <button type="button" className="border px-6 py-1">Edit</button>
                        </div>
                    </div>
                    <form className="flex-col gap-2 w-full max-w-sm" onSubmit={handleProfileInfoUpdate}>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={userName}
                            onChange={(ev) => setUserName(ev.target.value)}
                        />
                        <input
                            type="email"
                            disabled
                            value={user?.email || ''}
                        />
                        <button className="bg-primary rounded-full text-white px-6 py-2">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
