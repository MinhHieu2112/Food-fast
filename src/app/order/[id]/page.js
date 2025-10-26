'use client'
import SectionHeaders from "@/components/layout/sectionHeader"
import {CartContext} from "@/components/AppContext";
import {useContext, useState, useEffect} from "react";
import { useParams } from 'next/navigation';
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
    
    let subtotal = 0;
        if (order?.cartProducts?.length) {
            for (const p of order.cartProducts) {
                let productTotal = Number(p.basePrice);
                if (p.extraIngredientPrices?.length) {
                    for (const extra of p.extraIngredientPrices) {
                    productTotal += Number(extra.price);
                }
            }
            subtotal += productTotal;
        }
    }

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
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-center font-semibold mb-2">Delivery Information</h2>
                        <ul className="text-sm mt-2">
                            <li>Name: </li>
                            <li>Address: {order.streetAddress}</li>
                            <li>City: {order.city}</li>
                            <li>Phone: {order.phone}</li>
                        </ul>
                        <h2 className="text-center font-semibold mb-2 mt-2">Order Information</h2>
                        {order.cartProducts?.map((product, index) => (
                            <li key={index} className="border-b pb-2 mt-2 list-none text-sm">
                                <div className="flex justify-between">
                                    <strong>{product.name}</strong>
                                    <span>Price: ${product.basePrice}</span>
                                </div>
                                {product.extraIngredientPrices?.length > 0 && (
                                    <ul className="ml-6 list-disc">
                                        {product.extraIngredientPrices.map((extra, i) => (
                                            <li key={i} className="flex justify-between">
                                                <span>{extra.name}</span> 
                                                <span>+${extra.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                        <div className="flex justify-between font-semibold text-sm mt-2">
                            <div>
                                Subtotal:<br />
                                Delivery:<br />
                                Total:
                            </div>
                            <div className="font-semibold pl-2 text-right">
                                ${subtotal}<br />
                                +$5 <br />
                                ${subtotal + 5}
                            </div>
                        </div>
                        {/* <Address addressProps={order}/> */}
                    </div>
                    <div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}