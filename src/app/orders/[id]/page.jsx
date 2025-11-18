'use client'
import SectionHeaders from "@/components/layout/sectionHeader"
import {CartContext} from "@/components/AppContext";
import {useContext, useState, useEffect} from "react";
import { useParams } from 'next/navigation';
import OrderForm from "@/components/layout/OrderForm"
import MapComponent from "@/components/Map/MapComponent";
import DeliveryTimer from "@/components/Map/DeliveryTimer"
export default function OrderPage() {
    const {clearCart, cartProducts} = useContext(CartContext);
    const {id} = useParams();
    const [order, setOrder] = useState();
    useEffect(() => {
        if (typeof window.console !== "undefined") {
            if (window.location.href.includes('clear-cart=1')) {
                clearCart();
                // if (id) {
                //     fetch('/api/orders/mark-paid', {
                //         method: 'POST',
                //         headers: {'Content-Type': 'application/json'},
                //         body: JSON.stringify({ orderId: id }),
                //     })
                //     .then(response => response.json())
                //     .then(data => {
                //         if (data.success) {
                // //         // Xóa giỏ hàng trong Context
                //         clearCart(); // Gọi hàm clearCart từ CartContext
                //         }
                //     });
                // }
            }
        }
        if (id) {
            fetch('/api/orders?_id='+id)
                .then(res => res.json())
                .then(orderData => {
                    setOrder(orderData)
                });
        }
    }, [id, clearCart]);

    return (
        <section className="max-w-2xl mx-auto mt-8">
            <div className="text-center">
                <SectionHeaders mainHeader="Order detail"/>
                {/* <div>
                    <p>Thanks for your order.</p>
                    <p>We will call you when your order will be on the way</p>
                </div> */}
            </div>
            {order && (
                <div className="grid grid-cols-[1.3fr_1.7fr] gap-16 mt-8">
                    {/* Bên trái */}
                    <OrderForm order={order}/>
                    <div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            {/* Bên phải */}
                            <span className="text-center font-semibold"><DeliveryTimer initialMinutes={1} orderId={order._id.slice(-5)}/></span>
                            <MapComponent address={order.streetAddress} city={order.city} />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}