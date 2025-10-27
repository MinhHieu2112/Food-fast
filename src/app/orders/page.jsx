'use client';
import SectionHeaders from "@/components/layout/sectionHeader"
import UserTabs from "@/components/layout/tabs"
import { useState, useEffect } from "react";
import UseProfile from "@/components/UseProfile"
import Link from "next/link"

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const {loading, data:profile} = UseProfile();

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(orders => {
                setOrders(orders);
            })
    }, [])
    return(
        <section className="mt-8 max-w-2xl mx-auto">
            <UserTabs isAdmin={profile.isAdmin}/>
            <div className="mt-8 text-sm">
                {/* Header row */}
                <div className="grid grid-cols-5 font-semibold text-gray-700 border-b pb-2 mb-2 text-center">
                    <div>Order ID</div>
                    <div>Date</div>
                    <div>Name</div>
                    <div>Status</div>
                    <div>Details</div>
                </div>
                {orders?.length > 0 && orders.map(order => (
                    <div 
                        key={order._id} 
                        className="grid grid-cols-5 bg-gray-100 mb-2 p-4 rounded-lg items-center text-center">
                            <div>{order._id.slice(-5)}</div>
                            <div>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                            <div>{order.name}</div>
                            <div>
                                <span className={
                                    (order.paid ? 'bg-green-500' : 'bg-red-400')
                                    + ' p-2 rounded-md text-white'
                                }>
                                    {order.paid ? 'Paid' : 'Not paid'}
                                </span>
                            </div>
                            <div>
                                <Link href={`/orders/${order._id}`}>View</Link>
                            </div>
                    </div>
                ))}
            </div>
        </section>
    );
}