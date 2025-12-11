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
            <table className="w-full border-collapse text-center">
                <thead>
                    <tr>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Address</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Detail</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Rows */}
                    {stores?.length > 0 && stores.map(store => (
                        <tr
                            key={store._id}
                            className="border-t hover:bg-gray-50 transition-colors"
                        >

                            {/* Store Name */}
                            <td className="py-3 px-4">
                                {store.name || <span className="italic">No name</span>}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                                {store.address.street}, {store.address.district}, {store.address.city}
                            </td>

                            {/* Battery */}
                            <td className="py-3 px-4">
                                {store.status}
                            </td>
                            {/* View Button */}
                            <td className="py-3 px-4">
                                <Link
                                    className="btn-register bg-white text-sm hover:bg-gray-200 px-3 py-1 rounded-lg"
                                    href={`/store/edit/${store._id}`}
                                >
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
);
}