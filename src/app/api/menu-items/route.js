// import {MenuItem} from "@/models/Menu-items";
// import mongoose from "mongoose";

// export async function POST(req) {
//     mongoose.connect(process.env.MONGO_URL);
//     const data = await req.json();
//     const menuItemDoc = await MenuItem.create(data);
//     return Response.json(menuItemDoc);
// }

import mongoose from "mongoose";
import { MenuItem } from "@/models/Menu-items";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const data = await req.json();

    // Lưu vào MongoDB
    const menuItem = await MenuItem.create({
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      image: data.image, // <-- link Cloudinary ở đây
    });

    return Response.json(menuItem);
  } catch (err) {
    console.error("❌ Error creating menu item:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
