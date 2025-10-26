'use client';
import SectionHeaders from "@/components/layout/sectionHeader";
import {CartContext, cartProductPrice} from "@/components/AppContext";
import {useContext, useState, useEffect} from "react";
import Image from "next/image";
import Trash from "@/components/icons/trash"
import Address from "@/components/layout/Address"
import useProfile from "@/components/UseProfile"
import toast from "react-hot-toast"

export default function CartPage() {
    const {cartProducts, removeCartProduct} = useContext(CartContext);
    const [address, setAddress] = useState({});
    const {data: profileData} = useProfile();
    useEffect(() => {
        if (typeof window !== 'underfined') {
            if (window.location.href.includes('canceled=1')){
                toast.error('payment failed');
                }
            }
    }, [])
    useEffect(() => {
        if (profileData?.city) {
            const {phone, address, city, postal, country} = profileData;
            const addressFromProfile = {
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
        // address and shopping cart products

        const promise = new Promise((resolve, reject) => {
            fetch('/api/checkout', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                address,
                cartProducts,
                }),
            }).then(async (response) => {
                if(response.ok) {
                    resolve();
                    window.location = await response.json();
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
    
    if(cartProducts?.length === 0) {
        return (
            <section className="mt-8 text-center">
                <SectionHeaders mainHeader="Cart" />
                <p className="mt-4">Your shopping cart is empty</p>
            </section>
        );
    }

    return(
        <section className="mt-8">
            <div className="text-center">
                <SectionHeaders mainHeader="Cart" />
            </div>
            <div className="mt-8 grid gap-8 grid-cols-2">
                <div>
                     {cartProducts?.length === 0 && (
                        <div>No products in your shopping cart</div>
                )}
                {cartProducts?.length > 0 && cartProducts.map((product, index) => (
                    <div key={`${product._id}-${index}`} className="flex items-center gap-4 mb-2 border-b py-4">
                        <div className="w-24">
                            <Image width={240} height={240} src={product.image} alt={''} />
                        </div>
                        <div className="grow">
                            <h3 className="font-semibold">
                                {product.name}
                            </h3>
                            {product.sizes?.length > 0 && (
                                <div className="text-sm"> 
                                    Size: <span>{product.sizes[0].name} ${product.sizes[0].price}</span>
                                </div>
                            )}
                            {product.extras?.length > 0 && (
                                <div className="text-sm text-gray-500">
                                    {product.extras.map((extra, index) => (
                                        <div key={`${extra._id}-${index}`}>
                                            Extra: <span>{extra.name} ${extra.price}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="text-lg font-semibold">
                            ${cartProductPrice(product)}
                        </div>
                        <div className="ml-2">
                            <button
                                type="button"
                                onClick={() => removeCartProduct(index)} 
                                className="btn-register p-2">
                                <Trash />
                            </button>
                        </div>
                    </div>
                ))}
                    <div className="py-2 pr-16 flex justify-end items-center">
                        <div className="text-gray-500">
                            Subtotal:<br />
                            Delivery:<br />
                            Total:
                        </div>
                        <div className="font-semibold pl-2 text-right">
                            ${subtotal}<br />
                            $5 <br />
                            ${subtotal + 5}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2>Delivery</h2>
                    <form onSubmit={proceedToCheckout}>
                        <Address addressProps={address} setAddressProps={handleAddressChange}/>
                        <button type="submit" className="btn-register">Pay ${subtotal}</button>
                    </form>
                </div>
            </div>
        </section>
    );
}
