"use client";
import UserTabs from "@/components/layout/tabs"
import UseProfile from "@/components/UseProfile"
import Image from "next/image"
import EditableImage from "@/components/layout/EditableImage"
import {useState} from "react"
import toast from "react-hot-toast"

export default function MenuItemsPage() {

    const {loading, data} = UseProfile();
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [description, setDescription] = useState('');

    async function handleFormSubmit(ev) {
        ev.preventDefault();
        console.log("data", {image, name, description});
        const data = {image, name, description, basePrice}
        const savingPromise = new Promise(async(resolve, reject) => {
            const response = await fetch('/api/menu-items', {
            method: 'POST',
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
    } 
    if (loading) {
        return 'Loading user info';
    }

    if (!data.isAdmin) {
        return 'Not an admin';
    }

    return (
        <section className="mt-8 max-w-md mx-auto">
            <UserTabs isAdmin={true} />

            <form onSubmit={handleFormSubmit} className="mt-8 max-w-md mx-auto">
            {/* Chia hàng ngang: UploadFile bên trái, form bên phải */}
                <div className="flex items-start gap-4">
                    {/* BÊN TRÁI: Upload ảnh */}
                    <div className="w-1/3">
                        <EditableImage onUpload={setImage} />
                    </div>

                    {/* BÊN PHẢI: Thông tin món ăn */}
                    <div className="flex-1 flex-col gap-4">
                        <label>Item name</label>
                        <input type="text" value={name} onChange={ev => setName(ev.target.value)} />

                        <label>Description</label>
                        <textarea type="text" value={description} onChange={ev => setDescription(ev.target.value)} />

                        <label>Base Price</label>
                        <input type="text" value={basePrice}  onChange={ev => setBasePrice(ev.target.value)} />

                        <button className="bg-primary rounded-full text-white px-10 py-2 mt-4 self-start" type="submit">Save</button>
                    </div>
                </div>
            </form>
        </section>
    );
}