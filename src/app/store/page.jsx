'use client';
import useProfile from "@/components/UseProfile"
import {useEffect, useState, useRef} from "react"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link"
import Right from "@/components/icons/right"

export default function StorePage() {

    const {loading, data} = useProfile();
    const [stores, setStores] = useState([]);
    const router = useRouter();
    const toastId = useRef(null);

    useEffect(() => {
        fetch('/api/store').then(response => {
            response.json().then(stores => {
                setStores(stores);
                });
            });
    }, []);

    // Show loading toast only once
    useEffect(() => {
    if (loading && !toastId.current) {
        toastId.current = toast.loading("Loading store info...");
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
    <section className="max-w-2xl mx-auto mt-8">
        <div className="mt-8 text-sm">
            <Link 
                className="button flex mb-8"
                href={'/store/new'}>
                <span>Create new store</span>
                <Right />
            </Link>
            {/* Header */}
            <div className="grid grid-cols-4 font-semibold text-gray-700 border-b pb-3 mb-3 text-center">
                <div>Name</div>
                <div>Address</div>
                <div>Status</div>
                <div></div> {/* Cột nút View */}
            </div>

            {/* Rows */}
            {stores?.length > 0 && stores.map(store => (
                <div
                    key={store._id}
                    className="grid grid-cols-4 bg-gray-100 rounded-lg mb-2 p-2 px-4 items-center text-center"
                >

                    {/* Store Name */}
                    <div className="text-gray-700">
                        {store.name || <span className="italic">No name</span>}
                    </div>

                    {/* Status */}
                    <div className="text-gray-500">
                        {store.address.street}, {store.address.district}, {store.address.city}
                    </div>

                    {/* Battery */}
                    <div className="text-gray-500">
                        {store.status}
                    </div>
                    {/* View Button */}
                    <div>
                        <Link
                            className="btn-register bg-white text-sm hover:bg-gray-200 px-3 py-1 rounded-lg"
                            href={`/store/edit/${store._id}`}
                        >
                            View
                        </Link>
                    </div>

                </div>
            ))}

        </div>
    </section>
);
}