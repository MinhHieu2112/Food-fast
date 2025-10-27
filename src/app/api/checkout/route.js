import connectToDB from "@/libs/mongoConnect";
import Stripe from 'stripe';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import {Order} from "@/models/Order"
import {MenuItem} from "@/models/Menu-items"

const stripe = new Stripe(process.env.STRIPE_SK);

export async function POST(req) {
    await connectToDB();
    const {cartProducts, address} = await req.json();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    
    const orderDoc = await Order.create({
        userEmail,
        ...address,
        cartProducts,
        paid: false,
    });

    const stripeLineItems = [];
    for (const cartProduct of cartProducts) {

        const productInfo = await MenuItem.findById(cartProduct._id);

        let productPrice = Number(productInfo.basePrice);

        if (cartProduct.size) {
            const size = productInfo.sizes
                .find(size => size._id.toString() === cartProduct.size._id.toString());
            productPrice += Number(size.price);
        }
            console.log("Size", productPrice);
        if (cartProduct.extras?.length > 0) {
            for (const cartProductExtraThing of cartProduct.extras) {
                const productExtras = productInfo.extraIngredientPrices;
                const extraThingInfo = productExtras
                    .find(extra => extra._id.toString() === cartProductExtraThing._id.toString());
                productPrice += Number(extraThingInfo.price);
            }
        }
        
        const productName = cartProduct.name;
        console.log("Product:", productName, "Price:", productPrice);
        stripeLineItems.push({
            quantity: 1,
            price_data: {
                currency: 'USD',
                product_data: {
                    name: productName,
                },
                unit_amount: productPrice * 100,
            }
        });
    }

    // const baseUrl = process.env.NEXTAUTH_URL.endsWith('/')
    // ? process.env.NEXTAUTH_URL.slice(0, -1)
    // : process.env.NEXTAUTH_URL;

    // const successUrl = `${baseUrl}/cart?success=1`;
    // const cancelUrl = `${baseUrl}/cart?canceled=1`;

    const stripeSession = await stripe.checkout.sessions.create({
        line_items: stripeLineItems,
        mode: 'payment',
        customer_email: userEmail,
        success_url: process.env.NEXTAUTH_URL + '/' + 'orders/' + orderDoc._id.toString() + '?clear-cart=1',
        cancel_url: process.env.NEXTAUTH_URL + '/' + 'cart?canceled=1',
        metadata: {orderId: orderDoc._id.toString()},
        payment_intent_data: {
            metadata: {orderId: orderDoc._id.toString()},
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'Delivery fee',
                    type: 'fixed_amount',
                    fixed_amount: {amount: 500, currency: 'USD'},
                },
            }
        ],
    });
    console.log(stripeSession);
    return Response.json(stripeSession.url);
}