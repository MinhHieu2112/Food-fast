// import {authOptions} from "@/app/api/auth/[...nextauth]/route";
// import mongoose from "mongoose";
// import {getServerSession} from "next-auth";
// import {User} from "@/models/User"

// export async function PUT(req) {
//     mongoose.connect(process.env.MONGO_URL);
//     const data = await req.json();
//     const session = await getServerSession(authOptions);
//     const email = session.user.email;
//     const update={}
//     if('name' in data) {
//         //update user name
//         // await User.updateOne({email}, {name: data.name});
//         update.name = data.name
//     }
//     if (Object.keys(update).length > 0) {
//         await User.updateOne({email}, data);
//     }

//     return Response.json(true);
// }

// export async function GET() {
//     mongoose.connect(process.env.MONGO_URL);
//     const session = await getServerSession(authOptions);
//     const email = session.user.email;
//     return Response.json(
//         await User.findOne({email})
//     );
// }

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDB from "@/libs/mongoConnect"
import { getServerSession } from "next-auth";
import { User } from "@/models/User";

export async function PUT(req) {
  await connectToDB();

  const data = await req.json();
  const {_id, name, ...otherUserInfo} = data;
  console.log('Data nhận được:', data); // DEBUG
  console.log('otherUserInfo:', otherUserInfo); // DEBUG

  let filter = {};
  if (_id) {
    filter = {_id};
  } else {
    const session = await getServerSession(authOptions);
    const email = session.user.email;
    filter = { email };
  }

  await User.updateOne(filter, { name, ...otherUserInfo });
  return Response.json(true);
}

export async function GET(req) {
  await connectToDB();
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  
  let filterUser = {};
  if (_id) {
    filterUser = {_id};
  } else {
      const session = await getServerSession(authOptions);
      const user = await User.findOne({email: session?.user?.email}).lean();
      const email = session?.user?.email;
        if (!session || !session.user.email || !session.user) {
          return Response.json({ error: "Not authenticated" }, { status: 401 });
        }
      filterUser = { email: session.user.email };
      return Response.json({...user});
  }
}