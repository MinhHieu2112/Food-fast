'use client';
import SectionHeaders from "@/components/layout/sectionHeader"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import UseProfile from "@/components/UseProfile"
import Link from "next/link"
import DeliveryTimer from "@/components/Map/DeliveryProcess"

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const {loading, data:profile} = UseProfile();
    const router = useRouter();

    useEffect(() => {
    // Nếu không có profile và không đang loading -> logout xong -> quay về login
        if (!loading && !profile?._id) {
        router.push("/login");
        }
    }, [loading, profile]);

    useEffect(() => {
        if (profile?._id) {
            fetch('/api/orders')
            .then(res => res.json())
            .then(orders => {
                setOrders(orders);
            })
        }
    }, [profile])

    if (orders.length === 0){
        return (
            <section className="mt-8 text-center">

                <SectionHeaders mainHeader="Order" />
                <p className="mt-4">Your orders is empty</p>
            </section>
        );
    }
    return(
        <section className="mt-8 max-w-2xl mx-auto">
            <div className="mt-8 text-sm">
                <div className="overflow-x-auto rounded-xl">
                    <table className="w-full border-collapse text-center">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm">
                                <th className="py-3 px-4">Order ID</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Payment</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.length > 0 && orders.map(order => (
                                <tr 
                                    key={order._id} 
                                    className="border-t hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4 font-mono text-xs">
                                        {order._id.slice(-5)}
                                    </td>

                                    <td className="py-3 px-4">
                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </td>

                                    <td className="py-3 px-4">
                                        {order.name}
                                    </td>

                                    <td className="py-3 px-4">
                                        <span
                                            className={
                                                (order.paid ? "bg-green-500 " : "bg-red-400 ") +
                                                "text-white px-3 py-1 rounded-md text-xs"
                                            }
                                        >
                                            {order.paid ? "Paid" : "Not Paid"}
                                        </span>
                                    </td>

                                    <td className="py-3 px-4">
                                        {order.status}
                                    </td>

                                    <td className="py-3 px-4">
                                        <Link 
                                            href={`/orders/${order._id}`} 
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}