"use client";
import UserTabs from "@/components/layout/tabs"
import UseProfile from "@/components/UseProfile"
import UploadFile from "@/components/Upload"
import Image from "next/image"
import UploadImageBox from "@/components/Upload";
import {useState} from "react"
export default function MenuItemsPage() {

    const {loading, data} = UseProfile();
    const [image, setImage] = useState('');

    if (loading) {
        return 'Loading user info';
    }

    if (!data.isAdmin) {
        return 'Not an admin';
    }

    return (
        <section className="mt-8 max-w-md mx-auto">
            <UserTabs isAdmin={true} />
            <div className="max-w-md mx-auto mt-8">
                <div className="flex gap-4 items-center">
                    <div>
                        <div className="p-2 rounded-lg relative">
                            {/* <Image
                                className="rounded-lg w-full h-full mb-1"
                                    src={"" || "/default-avatar.png"}
                                    width={250}
                                    height={250}
                                    alt="avatar"
                                /> 
                            <label>
                                <input type="file" className="hidden" />
                                <span className="block border rounded-lg p-2 text-center">Edit</span>
                            </label> */}
                            <UploadImageBox defaultImage={image} onUpload={setImage} />
                        </div>
                    </div> 
                    <form className="flex-col gap-2 w-full max-w-sm">
                        <div className="">
                            <label>Item name</label>
                            <input type="text"/>
                        </div>
                        <div>
                            <label>Description</label>
                            <input type="text"/>
                        </div>
                        <div>
                            <label>Base Price</label>
                            <input type="text"/>
                        </div>
                        <div>
                            <button className="bg-primary rounded-full text-white px-10 py-2" type="submit">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}