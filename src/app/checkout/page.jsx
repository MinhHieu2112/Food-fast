'use client';
import SectionHeaders from "@/components/layout/sectionHeader";
import {CartContext, cartProductPrice} from "@/components/AppContext";
import {useContext, useState, useEffect} from "react";
import Image from "next/image";
import Address from "@/components/layout/Address"
import useProfile from "@/components/UseProfile"
import toast from "react-hot-toast"

export default function CheckoutPage() {
    const {cartProducts} = useContext(CartContext);
    const [address, setAddress] = useState({});
    const {data: profileData} = useProfile();
    const [store, setStore] = useState({});
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("card");

    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedOrder = localStorage.getItem("orderData");
            if (savedOrder) {
                const orderData = JSON.parse(savedOrder);
                setStore(orderData?.store || null);
                setNote(orderData?.note || "");
            }
        }
    }, []);
    console.log("Store", store)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.location.href.includes('canceled=1')){
                toast.error('payment failed');
                }
            }
    }, [])

    useEffect(() => {
        if (profileData?.city) {
            const {name ,phone, address, city, postal, country} = profileData;
            const addressFromProfile = {
                name,
                phone, 
                streetAddress: address, 
                city, 
                postalCode: postal, 
                country
            };
            setAddress(addressFromProfile);
        }
    }, [profileData]);
    
    let subtotal = 0;
    for (const p of cartProducts) {
        subtotal += cartProductPrice(p);
    }
    function handleAddressChange(propName, value) {
        setAddress(prevAddress => {
            return {...prevAddress, [propName]:value};
        });
    }
    async function proceedToCheckout(ev) {
    ev.preventDefault();

    // VALIDATION - Kiểm tra địa chỉ
    if (!address.name || !address.phone || !address.streetAddress || !address.city) {
        toast.error("Please fill in all delivery information!");
        return;
    }

    if (!store || !store._id) {
        toast.error("Please select a store first!");
        return;
    }

    // Nếu chọn cash → không dùng Stripe
    if (paymentMethod === "cash") {
        const promise = new Promise((resolve, reject) => {
            fetch("/api/checkout-cash", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    address,
                    cartProducts,
                    store,
                    note,
                }),
            })
            .then(async (res) => {
                const data = await res.json();
                
                if (res.ok && data.orderId) {
                    resolve();
                    //  Xóa localStorage trước khi redirect
                    localStorage.removeItem("orderData");
                    //  Redirect với flag clear-cart
                    window.location = `/orders/${data.orderId}?clear-cart=1`;
                } else {
                    console.error("API Error:", data);
                    reject(data.error || "Failed to create order");
                }
            })
            .catch(err => {
                console.error("Network Error:", err);
                reject(err);
            });
        });

        return await toast.promise(promise, {
            loading: "Creating your order...",
            success: "Order created successfully!",
            error: "Failed to create order.",
        });
    }

    // Nếu là payment bằng card → Stripe
        const promise = new Promise((resolve, reject) => {
            fetch('/api/checkout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    address,
                    cartProducts,
                    store,
                    note,
                }),
            }).then(async (response) => {
                if (response.ok) {
                    resolve();
                    const url = await response.json();
                    window.location = url;
                } else {
                    reject();
                }
            });
        });

        await toast.promise(promise, {
            loading: 'Preparing your order...',
            success: 'Redirecting to payment...',
            error: 'Something went wrong...',
        });
    }

    if (cartProducts?.length === 0) {
    return (
        <section className="mt-20 flex flex-col items-center text-center px-4">
            <SectionHeaders mainHeader="Your Cart" />

            <div className="mt-10 bg-white p-10 rounded-2xl flex flex-col items-center max-w-md">
                <Image
                    width={1000}
                    height={1000}
                    src="/empty-cart.png"
                    alt="Empty cart"
                    className="opacity-90"
                />

                <p className="text-gray-500 mt-8 mb-6">
                    Looks like you haven't added anything yet.
                </p>

                <a href="/menu" className=" text-lg font-medium hover:bg-yellow-600 transition">
                    Browse Menu
                </a>
            </div>
        </section>
    );
}

    return(
        <section className="mt-8">
            <div className="text-center">
                <SectionHeaders mainHeader="Payment Information" />
            </div>
            <div className="mt-8 grid gap-8 grid-cols-2 items-start" > 
                <div>
                    <form onSubmit={proceedToCheckout}>
                            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">
                                <h2 className="font-semibold text-lg mb-4">User Information</h2>
                                <label>Name</label>
                                <input type="text" 
                                        value={address.name || ''} 
                                        onChange={e => setAddress({...address, name: e.target.value})}/>
                                <Address addressProps={address} setAddressProps={handleAddressChange}/>
                            </div>
                            <div className="mt-6 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">
                                <h2 className="font-semibold text-lg mb-4">Payment method</h2>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="card" 
                                            checked={paymentMethod === "card"}
                                            onChange={() => setPaymentMethod("card")}
                                        />
                                        <span>Credit Card</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="cash"
                                            checked={paymentMethod === "cash"}
                                            onChange={() => setPaymentMethod("cash")}
                                        />
                                        <span>Cash Pay</span>
                                    </div>
                                </div>
                            <button type="submit" className="btn-register mt-6">Pay</button>
                    </form>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">
                    <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                    <div className="divide-y divide-gray-300/50 mb-4">
                        {cartProducts.map((product, index) => (
                            <div key={index} className="border-b pb-2 mt-2 list-none text-sm">
                                <div className="grow">
                                    <div className="flex justify-between">
                                        <strong>{product.name}</strong>
                                        <span>Price: ${product.basePrice}</span>
                                    </div>

                                    {product.size && (
                                        <div className="flex justify-between">
                                            Size: {product.size.name}
                                            <span>+${product.size.price}</span>
                                        </div>
                                    )}

                                    {product.extras?.length > 0 && (
                                        <ul className="list-disc">
                                            {product.extras.map((extra, i) => (
                                                <li key={i} className="flex justify-between">
                                                    <span>{extra.name}</span> 
                                                    <span>+${extra.price}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
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
                </div>
            </div>
        </section>
    );
}
