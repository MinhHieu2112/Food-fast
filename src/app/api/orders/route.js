import connectToDB from "@/libs/mongoConnect";
import {getServerSession} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import {User} from "@/models/User"
import { Order } from "@/models/Order";

export async function GET(req) {
    await connectToDB();

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    let isAdmin = false;

    const url = new URL(req.url); 
    const _id = url.searchParams.get('_id');
    if (_id) {
        return Response.json(await Order.findById(_id));
    }

    if(userEmail) {
        const userInfo = await User.findOne({email: userEmail});
        if(userInfo) {
            isAdmin = userInfo.isAdmin;
        }
    }

    if(isAdmin) {
        return Response.json(await Order.find());
    }

    if(userEmail) {
        return Response.json(await Order.find({userEmail}));
    }
}