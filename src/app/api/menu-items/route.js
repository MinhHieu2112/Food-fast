// import {MenuItem} from "@/models/Menu-items";
// import mongoose from "mongoose";

// export async function POST(req) {
//     await connectToDB();
//     const data = await req.json();
//     const menuItemDoc = await MenuItem.create(data);
//     return Response.json(menuItemDoc);
// }

import connectToDB from "@/libs/mongoConnect";
import { MenuItem } from "@/models/Menu-items";

export async function POST(req) {
  try {
    await await connectToDB();
    const data = await req.json();
    // 🩹 Chặn lỗi ObjectId rỗng
    if (!data.category || data.category === '') {
      delete data.category;
    }
    // Lưu vào MongoDB
    const menuItem = await MenuItem.create({
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      image: data.image, // <-- link Cloudinary ở đây
      sizes: data.sizes,
      extraIngredientPrices: data.extraIngredientPrices,
    });
    console.log("✅ Created menu item:", menuItem);
    return Response.json(menuItem);
  } catch (err) {
    console.error("❌ Error creating menu item:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectToDB();
  const {_id, ...data} = await req.json();
  await MenuItem.findByIdAndUpdate(_id, {
    ...data,
    sizes: data.sizes || [],
    extraIngredientPrices: data.extraIngredientPrices || [],
  });
  console.log("✅ Updated menu item:", _id);
  return Response.json(true);
}

export async function GET() {
  await connectToDB();
  return Response.json(
    await MenuItem.find()
  );
}

export async function DELETE(req) {
    await connectToDB();
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    await MenuItem.deleteOne({_id});
    return Response.json(true);
}