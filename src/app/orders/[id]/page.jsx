// 'use client'
// import SectionHeaders from "@/components/layout/sectionHeader"
// import {CartContext} from "@/components/AppContext";
// import {useContext, useState, useEffect, use} from "react";
// import { useParams } from 'next/navigation';
// import OrderForm from "@/components/layout/OrderForm"
// import DeliveryTimer from "@/components/Map/DeliveryTimer"
// import DeliveryMap from "@/components/Map/DeliveryMap"
// export default function OrderPage() {
//     const {clearCart} = useContext(CartContext);
//     const {id} = useParams();
//     const [order, setOrder] = useState();

//     useEffect(() => {
//         if (typeof window.console !== "undefined") {
//             if (window.location.href.includes('clear-cart=1')) {
//                 clearCart();
//                 // if (id) {
//                 //     fetch('/api/orders/mark-paid', {
//                 //         method: 'POST',
//                 //         headers: {'Content-Type': 'application/json'},
//                 //         body: JSON.stringify({ orderId: id }),
//                 //     })
//                 //     .then(response => response.json())
//                 //     .then(data => {
//                 //         if (data.success) {
//                 // //         // Xóa giỏ hàng trong Context
//                 //         clearCart(); // Gọi hàm clearCart từ CartContext
//                 //         }
//                 //     });
//                 // }
//             }
//         }
//         if (id) {
//             fetch('/api/orders?_id='+id)
//                 .then(res => res.json())
//                 .then(orderData => {
//                     setOrder(orderData)
//                 });
//         }
//     }, [id, clearCart]);

//     return (
//         <section className="max-w-2xl mx-auto mt-8">
//             <div className="text-center">
//                 <SectionHeaders mainHeader="Order detail"/>
//                 {/* <div>
//                     <p>Thanks for your order.</p>
//                     <p>We will call you when your order will be on the way</p>
//                 </div> */}
//             </div>
//             {order && (
//                 <div className="grid grid-cols-[1.3fr_1.7fr] gap-16 mt-8">
//                     {/* Bên trái */}
//                     <OrderForm order={order}/>
//                     <div>
//                         <div className="bg-gray-100 p-4 rounded-lg">
//                             {/* Bên phải */}
//                             <span className="text-center font-semibold"><DeliveryTimer initialMinutes={1} orderId={order._id.slice(-5)}/></span>
//                             <DeliveryMap address={order.streetAddress} city={order.city} storeId={order.store._id}/>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// }

'use client'
import SectionHeaders from "@/components/layout/sectionHeader"
import {CartContext} from "@/components/AppContext";
import {useContext, useState, useEffect} from "react";
import { useParams } from 'next/navigation';
import OrderForm from "@/components/layout/OrderForm"
import DeliveryTimer from "@/components/Map/DeliveryProcess"
import DeliveryMap from "@/components/Map/DeliveryMap"
import AdminPanel from "@/components/orders/AdminPanel";

export default function OrderPage() {
    const { clearCart } = useContext(CartContext);
    const { id } = useParams();

    const [order, setOrder] = useState();
    const [role, setRole] = useState(null);

    /* ---------- Cancel order ---------- */

    const handleCancelOrder = async () => {
    const confirmCancel = confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    const res = await fetch(`/api/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            orderId: order._id,
            status: "cancelled",
        }),
    });

    const data = await res.json();

    if (data.success) {
        alert("Order cancelled successfully!");
        window.location.reload(); // reload UI
    } else {
        alert(data.error || "Failed to cancel order");
    }
};

    /* ---------- Fetch User Role ---------- */
    useEffect(() => {
        fetch("/api/profile")
            .then(r => r.json())
            .then(data => setRole(data.role));
    }, []);

    /* ---------- Clear Cart & Load Order ---------- */
    useEffect(() => {
        if (window.location.href.includes("clear-cart=1")) {
            clearCart();
        }

        if (id) {
            fetch('/api/orders?_id=' + id)
                .then(res => res.json())
                .then(data => setOrder(data));
        }
    }, [id, clearCart]);

    if (!order || !role) return <div className="text-center mt-20">Loading...</div>;

    return (
        <section className="max-w-5xl mx-auto mt-8">
            <div className="text-center mb-6">
                <SectionHeaders mainHeader="Order Details" />
            </div>

            <div className="grid grid-cols-[1.2fr_1.8fr] gap-12 items-start">

                {/* LEFT: Order Info */}
                <OrderForm order={order} />

                {/* RIGHT: Actions depending on role */}
                <div className="space-y-6">

                    {/* USER VIEW */}
                    {role === "customer" && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
                            <DeliveryTimer 
                                initialMinutes={1} 
                                orderId={order._id.slice(-5)}
                            />
                            <DeliveryMap
                                address={order.streetAddress}
                                city={order.city}
                                storeId={order.store._id}
                            />
                            {/* CANCEL BUTTON — CUSTOMER */}
                            {/* {order.status !== "cancelled" && (
                                <button
                                    onClick={handleCancelOrder}
                                    className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition w-full"
                                >
                                    Cancel Order
                                </button>
                            )} */}
                        </div>
                    )}

                    {/* MANAGER VIEW */}
                    {/* {(role === "manager" || role === "admin") && (
                        <ManagerPanel order={order} />
                    )} */}

                    {/* ADMIN VIEW */}
                    {(role === "admin" || role ==="manager") && (
                        <AdminPanel order={order} />
                    )}
                </div>
            </div>
        </section>
    );
}
