import {Store} from "@/models/Store";
import { Order } from "@/models/Order";
import connectToDB from "@/libs/mongoConnect"

export async function POST(req) {
    try {
        await connectToDB();
        const data = await req.json();

        const newStore = await Store.create(data);

        return Response.json(newStore, { status: 200 });

    } catch (err) {
        console.log(err)
        return Response.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { _id, ...data } = body;

    if (!_id) {
      return Response.json({ error: "Missing restaurant ID" }, { status: 400 });
    }

    // Kiểm tra restaurant có tồn tại không
    const store = await Store.findById(_id);
    if (!store) {
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // RÀNG BUỘC
    // Ví dụ: không cho update nếu đang inactive
    if (store.status === "inactive") {
       return Response.json({ error: "Inactive restaurant cannot be edited" }, { status: 403 });
     }

    // Update an toàn
    const updated = await Store.findByIdAndUpdate(
      _id,
      {
        ...data,
        sizes: data.sizes ?? [],  // dùng nullish coalescing
      },
      { new: true, runValidators: true } // NEW: trả về bản mới
    );

    return Response.json(updated);
  }
  catch (error) {
    console.error("Update restaurant error:", error);

    return Response.json(
      { error: error.message || "Update failed" },
      { status: 500 }
    );
  }
}


export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const _id = searchParams.get('_id');

        // --- GET ONE ---
        if (_id) {
            const store = await Store.findById(_id);

            if (!store) {
                return Response.json({ error: "Restaurant not found" }, { status: 404 });
            }
            
            return Response.json(store);
        }

        // --- GET ALL ---
        const stores = await Store.find().sort({ createdAt: -1 });

        return Response.json(stores);

    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("_id");

    if (!id) {
      return Response.json({ error: "Missing _id" }, { status: 400 });
    }

    await connectToDB();

    // Kiểm tra tổng số store – không cho xóa nếu còn đúng 1 cái
    const totalStores = await Store.countDocuments();
    if (totalStores <= 1) {
      return Response.json(
        { error: "Không thể xóa vì chỉ còn 1 cửa hàng duy nhất." },
        { status: 400 }
      );
    }

    //  Kiểm tra xem store có đơn hàng nào không
    const hasOrders = await Order.exists({ store: id });
    if (hasOrders) {
      return Response.json(
        { error: "Không thể xóa vì cửa hàng đang có đơn hàng." },
        { status: 400 }
      );
    }

    // Xóa
    await Store.deleteOne({ _id: id });

    return Response.json({ success: true });
  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

