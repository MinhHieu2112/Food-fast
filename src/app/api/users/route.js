// import mongoose from "mongoose";
// import { User } from "@/models/User";

// export async function GET() {
//     await connectToDB();
//     const users = await User.find()
//     return Response.json(users);
// }

import connectToDB from "@/libs/mongoConnect"
import { User } from "@/models/User";

export async function GET(req) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('_id');

  if (_id) {
    const user = await User.findById(_id);
    return Response.json(user);
  }

  const users = await User.find();
  return Response.json(users);
}