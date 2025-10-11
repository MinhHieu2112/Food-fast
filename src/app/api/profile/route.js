import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {User} from "../../models/User"

export async function PUT(req) {
    mongoose.connect(process.env.MONGO_URL);
    const data = await req.json();
    const session = await getServerSession(authOptions);
    const email = session.user.email;
    const update={}
    if('name' in data) {
        //update user name
        // await User.updateOne({email}, {name: data.name});
        update.name = data.name
    }
    if (Object.keys(update).length > 0) {
        await User.updateOne({email}, data);
    }

    return Response.json(true);
}

export async function GET() {
    mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    const email = session.user.email;
    return Response.json(
        await User.findOne({email})
    );
}