'use client';
import SectionHeaders from "@/components/layout/sectionHeader"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import UseProfile from "@/components/UseProfile"
import Link from "next/link"
import DeliveryTimer from "@/components/Map/DeliveryTimer"


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
                {/* Header row */}
                <div className="grid grid-cols-6 font-semibold text-gray-700 border-b pb-3 mb-3 text-center">
                    <div>Order ID</div>
                    <div>Date</div>
                    <div>Name</div>
                    <div>Payment</div>
                    <div>Status</div>
                    <div>Details</div>
                </div>
                {orders?.length > 0 && orders.map(order => (
                    <div 
                        key={order._id} 
                        className="grid grid-cols-6 items-center bg-gray-50 hover:bg-gray-100 transition-colors mb-2 p-3 rounded-lg text-center">
                            <div className="font-mono text-xs">{order._id.slice(-5)}</div>
                            <div>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                            <div>{order.name}</div>
                            <div>
                                <span className={
                                    (order.paid ? 'bg-green-500' : 'bg-red-400')
                                    + 'text-white py-1 px-3 rounded-md'
                                }>
                                    {order.paid ? 'Paid' : 'Not paid'}
                                </span>
                            </div>
                            <div className="flex justify-center">
                                <DeliveryTimer initialMinutes={1} orderId={order._id.slice(-5)}/>
                            </div>
                            <div>
                                <Link href={`/orders/${order._id}`} className="text-blue-600 hover:underline">View</Link>
                            </div>
                    </div>
                ))}
            </div>
        </section>
    );
}