// 'use client';
// import SectionHeaders from "@/components/layout/sectionHeader";
// import {CartContext, cartProductPrice} from "@/components/AppContext";
// import {useContext, useState, useEffect} from "react";
// import Image from "next/image";
// import Trash from "@/components/icons/trash"
// import toast from "react-hot-toast"
// import MapComponent from "@/components/Map/MapComponent";
// import {useRouter} from "next/navigation";

// export default function CartPage() {
//      const router = useRouter(); // Thêm router
//     const {cartProducts, removeCartProduct} = useContext(CartContext);
//     const [address, setAddress] = useState({});
//     const [city, setCity] = useState('');
//     const [stores, setStores] = useState([]);
//     const [selectedStore, setSelectedStore] = useState(null);
//     const [note, setNote] = useState('');

//     useEffect(() => {
//         // Fetch store locations from API
//         fetch('/api/store')
//             .then(res => res.json())
//             .then(data => {
//                 setStores(data);
//                 if (data.length > 0) {
//                     setSelectedStore(data[0]); // Set default selected store
//                 }
//             });
//     }, []);

//     useEffect(() => {
//         // Fetch information from API
//         fetch('/api/profile')
//             .then(res => res.json())
//             .then(data => {
//                 setAddress(data.address || '');
//                 setCity(data.city || '');
//             });
//     }, []);

//     let subtotal = 0;
//     for (const p of cartProducts) {
//         subtotal += cartProductPrice(p);
//     }
    
//     // Hàm xử lý checkout
//     const handleCheckout = () => {
//         // Validate dữ liệu
//         if (!address || !city) {
//             toast.error('Please enter your delivery address');
//             return;
//         }

//         if (!selectedStore) {
//             toast.error('Please select a store');
//             return;
//         }

//         if (cartProducts.length === 0) {
//             toast.error('Your cart is empty');
//             return;
//         }

//         // Chuẩn bị dữ liệu đơn hàng
//         const orderData = {
//             cartProducts: cartProducts,
//             pricing: {
//                 subtotal: subtotal,
//                 delivery: 5,
//                 total: subtotal + 5
//             },
//             delivery: {
//                 address: address,
//                 city: city
//             },
//             store: {
//                 id: selectedStore._id,
//                 name: selectedStore.name,
//                 address: selectedStore.address,
//                 location: selectedStore.location
//             },
//             note: note,
//             timestamp: new Date().toISOString()
//         };

//         // Lưu vào localStorage để truyền sang trang checkout
//         localStorage.setItem('orderData', JSON.stringify(orderData));

//         // Chuyển sang trang checkout
//         router.push('/checkout');
//     };
    
//     if (cartProducts?.length === 0) {
//     return (
//         <section className="mt-20 flex flex-col items-center text-center px-4">
//             <SectionHeaders mainHeader="Your Cart" />

//             <div className="mt-10 bg-white p-10 rounded-2xl flex flex-col items-center max-w-md">
//                 <Image
//                     width={1000}
//                     height={1000}
//                     src="/empty-cart.png"
//                     alt="Empty cart"
//                     className="opacity-90"
//                 />

//                 <p className="text-gray-500 mt-8 mb-6">
//                     Looks like you haven't added anything yet.
//                 </p>

//                 <a href="/menu" className="btn-register text-lg font-medium hover:bg-gray-100 transition">
//                     Browse Menu
//                 </a>
//             </div>
//         </section>
//     );
// }

//     return(
//         <section className="mt-8">
//             <div className="text-center">
//                 <SectionHeaders mainHeader="Cart" />
//             </div>
//             <div className="mt-8 grid gap-8 grid-cols-2 items-start">
//                 <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">
//                      {cartProducts?.length === 0 && (
//                         <Image width={240} height={240} src="/empty-cart.png" alt={''} />
//                 )}
//                 {cartProducts?.length > 0 && cartProducts.map((product, index) => (
//                     <div key={`${product._id}-${index}`} className="flex items-center gap-4 mb-2 border-b py-4">
//                         <div className="w-24">
//                             <Image width={240} height={240} src={product.image} alt={''} />
//                         </div>
//                         <div className="grow">
//                             <h3 className="font-semibold">
//                                 {product.name}
//                             </h3>
//                             {product.sizes?.length > 0 && (
//                                 <div className="text-sm"> 
//                                     Size: <span>{product.sizes[0].name} ${product.sizes[0].price}</span>
//                                 </div>
//                             )}
//                             {product.extras?.length > 0 && (
//                                 <div className="text-sm text-gray-500">
//                                     {product.extras.map((extra, index) => (
//                                         <div key={`${extra._id}-${index}`}>
//                                             Extra: <span>{extra.name} ${extra.price}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="text-lg font-semibold">
//                             ${cartProductPrice(product)}
//                         </div>
//                         <div className="ml-2">
//                             <button
//                                 type="button"
//                                 onClick={() => removeCartProduct(index)} 
//                                 className="btn-register p-2">
//                                 <Trash />
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//                     <div className="py-2 pr-16 flex justify-end items-center">
//                         <div className="text-gray-500">
//                             Subtotal:<br />
//                             Delivery:<br />
//                             Total:
//                         </div>
//                         <div className="font-semibold pl-2 text-right">
//                             ${subtotal}<br />
//                             $5 <br />
//                             ${subtotal + 5}
//                         </div>
//                     </div>
                    
//                     {/* Phần Note - Thêm ở đây, bên dưới sản phẩm */}
//                     <div className="mt-6 pt-4 border-t">
//                         <label className="block font-semibold mb-2 text-gray-700">
//                              Order Notes (Optional)
//                         </label>
//                         <textarea
//                             placeholder="Add special instructions, allergies, or delivery notes..."
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:border-transparent min-h-[100px] resize-none"
//                             value={note}
//                             onChange={(e) => setNote(e.target.value)}
//                             maxLength={500}
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                             {note.length}/500 characters
//                         </p>
//                     </div>
//                 </div>
//                 <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">
//                     <h2 className="font-semibold text-xl mb-4">Delivery Address</h2>

//                     {/* Địa chỉ người dùng */}
//                     <input
//                         type="text"
//                         placeholder="Street address"
//                         className="input"
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                     />
//                     <input
//                         type="text"
//                         placeholder="City"
//                         className="input mt-2"
//                         value={city}
//                         onChange={(e) => setCity(e.target.value)}
//                     />

//                     {/* Cửa hàng gần nhất */}
//                     <label className="block mt-4 font-semibold">Nearest Store</label>
//                         <select
//                         className="input"
//                         value={selectedStore?._id || ""}
//                         onChange={(e) => {
//                             const store = stores.find(s => s._id === e.target.value);
//                             setSelectedStore(store);
//                         }}
//                         >
//                         {stores.map(store => (
//                             <option key={store._id} value={store._id}>
//                             {store.name} — {store.address.street}
//                             </option>
//                         ))}
//                         </select>

//                     {/* Bản đồ */}
//                     <div className="mt-4">
//                         <MapComponent
//                             address={address}
//                             city={city}
//                             selectedStore={selectedStore}
//                             setSelectedStore={setSelectedStore}
//                         />
//                     </div>
//                     <button type="submit" className="btn-register mt-4" onClick={handleCheckout}>Check out ${subtotal+5}</button>
//                 </div>
//             </div>
//         </section>
//     );
// }

'use client';
import SectionHeaders from "@/components/layout/sectionHeader";
import { CartContext, cartProductPrice } from "@/components/AppContext";
import { useContext, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Trash from "@/components/icons/trash";
import toast from "react-hot-toast";
import MapComponent from "@/components/Map/MapComponent";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();
    const { cartProducts, removeCartProduct } = useContext(CartContext);

    // User address object: { street, city }
    const [address, setAddress] = useState({ street: "", city: "" });

    // Store data
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);

    const [note, setNote] = useState("");

    /* ------------------------  FETCH PROFILE  ------------------------ */
    useEffect(() => {
        fetch("/api/profile")
            .then(r => r.json())
            .then(data => {
                setAddress({
                    street: data.address || "",
                    city: data.city || "",
                });
            });
    }, []);

    /* ------------------------  FETCH STORES  ------------------------- */
    useEffect(() => {
        fetch("/api/store")
            .then(r => r.json())
            .then(data => {
                const activeStores = data.filter(store => store.status === "active");
                setStores(activeStores);

                // auto-select first active store
                if (activeStores.length > 0) {
                    setSelectedStore(activeStores[0]);
                } else {
                    setSelectedStore(null);
                }
            });
    }, []);

    /* ------------------------  SUBTOTAL  ----------------------------- */
    let subtotal = 0;
        for (const p of cartProducts) {
            subtotal += cartProductPrice(p);
        }

    const DELIVERY_FEE = 5;
    const total = subtotal + DELIVERY_FEE;

    /* ------------------------  CHECKOUT LOGIC  --------------------------- */
    const handleCheckout = () => {
        if (!address.street.trim() || !address.city.trim()) {
            toast.error("Please enter your delivery address");
            return;
        }

        if (!selectedStore) {
            toast.error("Please select a store");
            return;
        }

        if (cartProducts.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        const orderData = {
            cartProducts,
            pricing: {
                subtotal,
                delivery: DELIVERY_FEE,
                total,
            },
            delivery: address,
            store: selectedStore,
            note,
        };

        localStorage.setItem("orderData", JSON.stringify(orderData));
        router.push("/checkout");
    };
    
    /* ------------------------  EMPTY CART ---------------------------- */
    if (cartProducts.length === 0) {
        return (
            <section className="mt-20 flex flex-col items-center text-center px-4">
                <SectionHeaders mainHeader="Your Cart" />
                <div className="mt-10 bg-white p-10 rounded-2xl flex flex-col items-center max-w-md">
                    <Image width={1000} height={1000} src="/empty-cart.png" alt="Empty cart" className="opacity-90" />
                    <p className="text-gray-500 mt-8 mb-6">Looks like you haven't added anything yet.</p>
                    <a href="/menu" className="btn-register text-lg font-medium hover:bg-gray-100 transition">
                        Browse Menu
                    </a>
                </div>
            </section>
        );
    }

    /* ------------------------  MAIN RENDER ---------------------------- */
    return (
        <section className="mt-8">
            <div className="text-center">
                <SectionHeaders mainHeader="Cart" />
            </div>
        
            <div className="mt-8 grid gap-8 grid-cols-2 items-start">
                {/* ------------------------  LEFT SIDE: PRODUCTS  ------------------------ */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">

                    {cartProducts.map((product, index) => (
                        <div key={`${product._id}-${index}`} className="flex items-center gap-4 mb-2 border-b py-4">
                            <div className="w-24">
                                <Image width={240} height={240} src={product.image} alt={product.name} />
                            </div>

                            <div className="grow">
                                <div className="flex justify-between">
                                    <strong>{product.name}</strong>
                                    <span> ${product.basePrice}</span>
                                </div>

                                {/* Size */}
                                {product.size && (
                                    <div className="flex justify-between">
                                        Size: {product.size.name}
                                            <span>+${product.size.price}</span>
                                    </div>
                                )}

                                {/* Extras */}
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

                            <button
                                type="button"
                                onClick={() => removeCartProduct(index)}
                                className="p-1.5 w-9 h-9 flex items-center justify-center rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                            >
                                <Trash />
                            </button>
                        </div>
                    ))}

                    {/* Price summary */}
                    <div className="flex justify-between font-semibold text-sm mt-2">
                        <div >Subtotal:<br />Delivery:<br />Total:</div>
                        <div className="font-semibold pl-2 text-right">
                            ${subtotal}<br />${DELIVERY_FEE}<br />${total}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="mt-6 pt-4 border-t">
                        <label className="block font-semibold mb-2 text-gray-700">Order Notes (Optional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            maxLength={500}
                            className="w-full p-3 border rounded-lg resize-none min-h-[100px]"
                            placeholder="Add instructions, allergies, etc."
                        />
                        <p className="text-xs text-gray-500">{note.length}/500 characters</p>
                    </div>
                </div>

                {/* ------------------------  RIGHT SIDE: ADDRESS + STORE  ------------------------ */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">
                    <h2 className="font-semibold text-xl mb-4">Delivery Address</h2>

                    <input
                        type="text"
                        placeholder="Street address"
                        className="input"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="City"
                        className="input mt-2"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />

                    <label className="block mt-4 font-semibold">Nearest Store</label>
                    <select
                        className="input"
                        value={selectedStore?._id}
                        onChange={(e) => {
                            const store = stores.find(s => s._id === e.target.value);
                            setSelectedStore(store);
                        }}
                    >
                        {stores.map(store => (
                            <option key={store._id} value={store._id}>
                                {store.name} — {store.address.street}
                            </option>
                        ))}
                    </select>

                    <div className="mt-4">
                        <MapComponent
                            address={address.street}
                            city={address.city}
                            selectedStore={selectedStore}
                            setSelectedStore={setSelectedStore}
                        />
                    </div>

                    <button className="btn-register mt-4" onClick={handleCheckout}>
                        Check out ${total}
                    </button>
                </div>
            </div>
        </section>
    );
}
