//Trang menu sản phẩm của admin
'use client';
import UseProfile from "@/components/UseProfile"
import Link from "next/link"
import Right from "@/components/icons/right"
import {useState, useEffect} from "react"
import Image from "next/image"


export default function MenuItemsPage() {

    const [menuItems, setMenuItems] = useState([]);
    const {loading, data} = UseProfile();
    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(menuItems => {
                setMenuItems(menuItems);
            });
        });
    }, []);

    if (loading) {
        return 'Loading user info';
    }

    if (!data || !data.isAdmin) {
        return 'Not an admin';
    }


    return (
        <section className="mt-8 max-w-2xl mx-auto">
            <div className="mt-8">
                <Link 
                    className="button flex"
                    href={'/menu-items/new'}>
                    <span>Create new menu item</span>
                    <Right />
                </Link>
            </div>
            <div>
                <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
                <div className="grid grid-cols-3 gap-2">
                    {menuItems?.length > 0 && menuItems.map(item => (
                    <Link href={'/menu-items/edit/'+item._id} key={item._id} 
                        className="bg-gray-200 p-4 rounded-lg text-center group hover:bg-white hover:shadow-md hover:shadow-black/75 transition-all">
                            <div className="text-center">
                                <div className="w-full h-[150px] flex items-center justify-center">
                                    <Image className="rounded-md object-cover w-full h-full"
                                    src={item.image || '/no-image.jpg'} 
                                    alt={item.name || 'Menu item'} 
                                    width={200} 
                                    height={200} />
                                </div>
                                <div className="text-center mt-2 font-medium">
                                    {item.name}
                                </div>
                            </div>
                    </Link>
                ))}
                </div>
            </div>
        </section>
    );
}