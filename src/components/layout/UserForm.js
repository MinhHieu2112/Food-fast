'use client';
import {useState} from "react";
import {useEffect} from "react";
import useProfile from "@/components/UseProfile"
export default function UserForm({user, onSave}) {
    console.log(user);
    const [userName, setUserName] = useState('');
    //const [image, setImage] = useState('');
    const [phone, setPhone] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [admin, setAdmin] = useState(user?.admin || false);
    const {data: loggedInUserData} = useProfile();

    useEffect(() => {
        console.log("user data from API ===>", user);
        if (user) {
            setUserName(user.name || '');
            setPhone(user.phone || '');
            setStreetAddress(user.address || '');
            setPostalCode(user.postal || '');
            setCity(user.city || '');
            setCountry(user.country || '');
            setAdmin(String(user.isAdmin) === 'true');
        }
    }, [user]);
    if (!user) return null;
    return (
        <div className="flex gap-4">
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
            <form className="grow" 
                    onSubmit={ev => 
                        onSave(ev, {
                            name: userName,
                            phone,
                            address: streetAddress,
                            postal: postalCode,
                            city,
                            country,
                            isAdmin: admin,
                        })}>
                <div>
                    <label>Full name</label>
                <input
                    type="text"
                    placeholder="Full name"
                    value={userName || ''}
                    onChange={(ev) => setUserName(ev.target.value)}
                />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" disabled value={user?.email || ''} />
                </div>
                <div>
                    <label>Phone</label>
                    <input type="tel" placeholder="Phone number" value={phone || ''} onChange={(ev) => setPhone(ev.target.value)}/>
                </div>
                <div>
                    <label>Address</label>
                    <input type="text" placeholder="Street Address" value={streetAddress || ''} onChange={(ev) => setStreetAddress(ev.target.value)} />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label>Postal code </label>
                        <input type="text" placeholder="Postal code" value={postalCode || ''} onChange={(ev) => setPostalCode(ev.target.value)}/>
                    </div>
                    <div>
                        <label>City</label>
                        <input type="text" placeholder="City" value={city || ''} onChange={(ev) => setCity(ev.target.value)}/>
                    </div>
                </div>
                <label>Country</label>
                <input 
                    type="text"
                    placeholder="Country"
                    value={country || ''}
                    onChange={(ev) => setCountry(ev.target.value)}
                    />
                    {loggedInUserData?.isAdmin && (
                    <div>
                        {JSON.stringify(admin)}
                        <label htmlFor="adminCb" className="p-2 inline-flex items-center gap-2">
                            <input id="adminCb" type="checkbox"
                                    checked={admin === true || admin === 'true'}
                                    onChange={ev => setAdmin(ev.target.checked)}/>    
                            <span>Admin</span>
                        </label>
                    </div>
                    )}
                <button className="bg-primary btn-register" type="submit">
                    Save
                </button>
            </form>
        </div>
        );
}