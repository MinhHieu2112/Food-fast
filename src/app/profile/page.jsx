'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast"
import '../../app/globals.css';
import UserTabs from "@/components/layout/tabs"
import UserForm from "@/components/layout/UserForm"

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileFetched, setProfileFetched] = useState(false);
    //const {status} = session;
    
    useEffect(() => {  
        if (status === 'authenticated') {
            //setUserName(session.user.name);
            fetch('/api/profile').then(response => {
                response.json().then(data => {
                    setUser(data);
                    setIsAdmin(data.isAdmin);
                    setProfileFetched(true);
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
    //const user = session.user;
    //const userImage = user?.image || '/default-avatar.png';

//    async function handleProfileInfoUpdate(ev, data) {
//         ev.preventDefault();

//             const response = await fetch('/api/profile', {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data),
//             credentials: 'include'
//             });

//             if (response.ok) {
//                 toast.success('Profile saved!')
//                 await update({
//                     name: userName,
//                      address: streetAddress,
//                     phone: phone,
//                     postal: postalCode,
//                     city: city,
//                     country: country
//                 });
//             } else {
//                 toast.error('Something went wrong!')
//             }
//     }

    // Update profile handler
  async function handleProfileInfoUpdate(ev, data) {
    ev.preventDefault();

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Profile saved!');
        
        // Update local user state
        setUser(prev => ({ ...prev, ...data }));
        
        // Update session if name changed
        if (data.name && data.name !== session?.user?.name) {
          await update({ name: data.name });
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  }

    // async function handleFileChange(ev){
    //     const files = ev.target.files;
    //     if (files?.length === 1) {
    //         const data = new FormData;
    //         data.set('file', files[0]);
    //         toast('Uploading ...');
    //         const response = await fetch('/api/upload', {
    //             method: 'POST',
    //             body: data,
    //         });
    //         const link = await response.json();
    //     }
    // }
    return (
        <section className="mt-8">
                <div className="max-w-lg mx-auto mt-8">
                    <UserForm user={user} onSave={handleProfileInfoUpdate} showAdmin={false}/>
                </div>
        </section>
    );
}

