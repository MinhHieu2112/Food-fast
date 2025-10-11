'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast"
import '../../app/globals.css';
import Link from "next/link"

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    console.log({session});
    const router = useRouter();
    const [userName, setUserName] = useState('');
    //const [image, setImage] = useState('');
    const [phone, setPhone] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    //const {status} = session;
    
    useEffect(() => {  
        if (status === 'authenticated') {
            //setUserName(session.user.name);
            fetch('/api/profile').then(response => {
                response.json().then(data => {
                    setUserName(data.name)
                    setPhone(data.phone);
                    setStreetAddress(data.address);
                    setPostalCode(data.postal);
                    setCity(data.city);
                    setCountry(data.country);
                    setIsAdmin(data.isAdmin)
                })
            })
        }
    }, [status, session]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return null; // đã chuyển hướng rồi
    }

    // session tồn tại
    const user = session.user;
    //const userImage = user?.image || '/default-avatar.png';

    async function handleProfileInfoUpdate(ev) {
        ev.preventDefault();

            const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: userName,
                address: streetAddress,
                phone: phone,
                postal: postalCode,
                city: city,
                country: country
            }),
            credentials: 'include'
            });

            if (response.ok) {
                toast.success('Profile saved!')
                await update({
                    name: userName,
                    address: streetAddress,
                    phone: phone,
                    postal: postalCode,
                    city: city,
                    country: country
                });
            } else {
                toast.error('Something went wrong!')
            }
    }

    async function handleFileChange(ev){
        const files = ev.target.files;
        if (files?.length === 1) {
            const data = new FormData;
            data.set('file', files[0]);
            toast('Uploading ...');
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });
            const link = await response.json();
        }
    }
    return (
        <section className="mt-8">
            <div className="flex gap-2 mx-auto tabs jussttify-center">
                <Link className="active" href={'/profile'}>Profile</Link>
                {isAdmin && (
                    <>
                        <Link href={'/categories'}>Categories</Link>
                        <Link href={'/menu-items'}>Menu Items</Link>
                        <Link href={'/users'}>Users</Link>
                    </>
                )}
            </div>
            <h1 className="text-center text-primary text-4xl mb-4"></h1>
            <div className="max-w-md mx-auto">
                <div className="flex gap-4 items-center">
                    <div>
                        {/* <div className="p-2 rounded-lg relative">
                            <Image
                                className="rounded-lg w-full h-full mb-4"
                                src={userImage}
                                width={250}
                                height={250}
                                alt="avatar"
                            /> 
                            <label>
                                <input type="file" className="hidden" onChange={handleFileChange}/>
                                <span className="block border rounded-lg p-2 text-center">Edit</span>
                            </label>
                        </div> */}
                    </div>
                    <form className="flex-col gap-2 w-full max-w-sm" onSubmit={handleProfileInfoUpdate}>
                        <div>
                            <label>Full name</label>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={userName}
                            onChange={(ev) => setUserName(ev.target.value)}
                        />
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="email" disabled value={user?.email || ''} />
                        </div>
                        <div>
                            <label>Phone</label>
                            <input type="tel" placeholder="Phone number" value={phone} onChange={(ev) => setPhone(ev.target.value)}/>
                        </div>
                        <div>
                            <label>Address</label>
                            <input type="text" placeholder="Street Address" value={streetAddress} onChange={(ev) => setStreetAddress(ev.target.value)} />
                        </div>
                        
                        <div className="flex gap-4">
                            <div>
                                <label>Postal code </label>
                                <input type="text" placeholder="Postal code" value={postalCode} onChange={(ev) => setPostalCode(ev.target.value)}/>
                            </div>
                            <div>
                                <label>City</label>
                            <input type="text" placeholder="City" value={city} onChange={(ev) => setCity(ev.target.value)}/>
                            </div>
                        </div>
                        <label>Country</label>
                        <input 
                            type="text"
                            placeholder="Country"
                            value={country}
                            onChange={(ev) => setCountry(ev.target.value)}
                            />
                        <button className="bg-primary rounded-full text-white w-full py-2">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

