import connectToDB from "@/libs/mongoConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Order } from "@/models/Order";

export async function POST(req) {
    await connectToDB();
    
    const { cartProducts, address, store, note } = await req.json();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    // Validation
    if (!address?.name || !address?.phone || !address?.streetAddress || !address?.city) {
        return Response.json(
            { error: "Missing address information" }, 
            { status: 400 }
        );
    }

    if (!cartProducts || cartProducts.length === 0) {
        return Response.json(
            { error: "Cart is empty" }, 
            { status: 400 }
        );
    }

    try {
        // Tạo order với paid: false (vì là cash)
        const orderDoc = await Order.create({
            userEmail,
            ...address,
            cartProducts,
            store,
            note,
            paid: false,  // ← Quan trọng: cash chưa thanh toán
            status: 'pending',
            paymentMethod: 'offline',
        });

        console.log(" Cash order created:", orderDoc._id);

        return Response.json({ 
            orderId: orderDoc._id.toString(),
            success: true 
        });
    } catch (error) {
        console.error(" Order creation error:", error);
        return Response.json(
            { error: "Failed to create order" }, 
            { status: 500 }
        );
    }
}