import { User } from "@/models/User";
import mongoose from "mongoose";

import bcrypt from "bcrypt";

export async function POST(req) {
  await mongoose.connect(process.env.MONGO_URL, { dbName: "Food-fast" });

  const body = await req.json();
  const pass = body.password;

  // Kiểm tra password
  if (!pass || pass.length < 5) {
    return Response.json(
      { error: "Password must be at least 5 characters" },
      { status: 400 }
    );
  }

  // Băm mật khẩu
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(pass, salt); 
  body.password = hashedPassword;

  // Tạo user mới
  const createdUser = await User.create(body);

  return Response.json(createdUser);
}
