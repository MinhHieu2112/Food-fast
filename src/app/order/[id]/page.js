'use client'
import SectionHeaders from "@/components/layout/sectionHeader"
import {CartContext} from "@/components/AppContext";
import {useContext, useState, useEffect} from "react";
import { useParams } from 'next/navigation';
import OrderForm from "@/components/layout/OrderForm"
export default function OrderPage() {
    const {clearCart, cartProducts} = useContext(CartContext);
    const {id} = useParams();
    const [order, setOrder] = useState();
    useEffect(() => {
        if (typeof window.console !== "underfined") {
            if (window.location.href.includes('clear-cart=1')) {
                clearCart();
            }
        }
        if (id) {
            fetch('/api/order?_id='+id)
                .then(res => res.json())
                .then(orderData => {
                    setOrder(orderData)
                });
        }
    }, []);

    return (
        <section className="max-w-2xl mx-auto mt-8">
            <div className="text-center">
                <SectionHeaders mainHeader="Your order"/>
                <div>
                    <p>Thanks for your order.</p>
                    <p>We will call you when your order will be on the way</p>
                </div>
            </div>
            {order && (
                <div className="grid grid-cols-2 gap-16 mt-8">
                    <OrderForm order={order}/>
                    <div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <pre>{JSON.stringify(order, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}