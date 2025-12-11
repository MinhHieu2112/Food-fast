import connectToDB from "@/libs/mongoConnect";
import {getServerSession} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import {User} from "@/models/User"
import { Order } from "@/models/Order";

export async function GET(req) {
    await connectToDB();

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    let role = false;

    const url = new URL(req.url); 
    const _id = url.searchParams.get('_id');
    if (_id) {
        return Response.json(await Order.findById(_id));
    }

    if(userEmail) {
        const userInfo = await User.findOne({email: userEmail});
        if(userInfo) {
            role = userInfo.role;
        }
    }

    if(role === 'admin' || role === 'manager') {
        return Response.json(await Order.find());
    }

    if(userEmail) {
        return Response.json(await Order.find({userEmail}));
    }
}

export async function DELETE(req) {
    try {
        await connectToDB();
        
        const url = new URL(req.url);
        const id = url.searchParams.get("_id");
        
        if (!id) {
            return Response.json({ error: "Missing _id" }, { status: 400 });
        }

        // Tìm order trước
        const order = await Order.findById(id);
        
        if (!order) {
            return Response.json({ error: "Order not found" }, { status: 404 });
        }

        // Kiểm tra status
        const orderStatus = order.status?.toLowerCase() || 'pending';
        
        if (orderStatus !== 'cancelled' && orderStatus !== 'cancel') {
            return Response.json({ 
                error: "Only cancelled orders can be deleted",
                currentStatus: order.status 
            }, { status: 403 });
        }

        // Xóa nếu status hợp lệ
        await Order.deleteOne({ _id: id });
        
        return Response.json({ 
            success: true,
            message: "Order deleted successfully" 
        });
        
    } catch (err) {
        console.error("Delete order error:", err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectToDB();
        
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;
        
        if (!userEmail) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user info để check role
        const userInfo = await User.findOne({ email: userEmail });
        const userRole = userInfo?.role;

        const body = await req.json();
        const { _id, status, ...otherData } = body;

        // Validation
        if (!_id) {
            return Response.json(
                { error: "Missing order ID" },
                { status: 400 }
            );
        }

        if (!status) {
            return Response.json(
                { error: "Missing status" },
                { status: 400 }
            );
        }

        // Validate status value
        const validStatuses = ['pending', 'cancelled', 'delivered', 'delivering'];
        if (!validStatuses.includes(status.toLowerCase())) {
            return Response.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        // Kiểm tra order có tồn tại không
        const order = await Order.findById(_id);
        
        if (!order) {
            return Response.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        console.log("🔍 PATCH Order Debug:");
        console.log("- User email:", userEmail);
        console.log("- User role:", userRole);
        console.log("- Order email:", order.userEmail);
        console.log("- Current status:", order.status);
        console.log("- New status:", status);

        // ================================
        //  RÀNG BUỘC BUSINESS LOGIC
        // ================================

        // RÀNG BUỘC 1: Không thể cập nhật order đã delivered
        if (order.status?.toLowerCase() === 'delivered') {
            return Response.json(
                { error: "Delivered orders cannot be modified" },
                { status: 403 }
            );
        }

        // RÀNG BUỘC 2: Không thể cập nhật order đã cancelled
        if (order.status?.toLowerCase() === 'cancelled') {
            return Response.json(
                { error: "Cancelled orders cannot be modified" },
                { status: 403 }
            );
        }

        // ================================
        //  PHÂN QUYỀN THEO ROLE
        // ================================

        //  CUSTOMER - Chỉ được CANCEL đơn hàng của mình
        if (!userRole || userRole === 'user') {
            // Chỉ cho phép cancel
            if (status.toLowerCase() !== 'cancelled') {
                return Response.json(
                    { error: "Customers can only cancel orders" },
                    { status: 403 }
                );
            }

            // Chỉ cancel đơn của mình
            if (order.userEmail !== userEmail) {
                return Response.json(
                    { error: "You can only cancel your own order" },
                    { status: 403 }
                );
            }

            // Không thể cancel đơn đang giao
            if (order.status?.toLowerCase() === 'delivering') {
                return Response.json(
                    { error: "Cannot cancel order that is being delivered" },
                    { status: 403 }
                );
            }
        }

        // MANAGER - Có thể cập nhật orders của store mình
        if (userRole === 'manager') {
            const managerStoreId = userInfo.storeId?.toString();
            
            // Lấy orderStoreId an toàn
            let orderStoreId;
            if (typeof order.store === 'string') {
                orderStoreId = order.store;
            } else if (order.store?._id) {
                orderStoreId = order.store._id.toString();
            } else if (order.store?.id) {
                orderStoreId = order.store.id.toString();
            }

            // RÀNG BUỘC: Manager chỉ quản lý orders của store mình
            if (managerStoreId !== orderStoreId) {
                return Response.json(
                    { error: "You can only update orders from your store" },
                    { status: 403 }
                );
            }

            // RÀNG BUỘC: Manager không thể cancel orders
            if (status.toLowerCase() === 'cancelled') {
                return Response.json(
                    { error: "Managers cannot cancel orders. Only customers can cancel." },
                    { status: 403 }
                );
            }
        }

        // 3️⃣ ADMIN - Có thể cập nhật tất cả orders (với một số ràng buộc)
        if (userRole === 'admin') {
            // RÀNG BUỘC: Admin không thể đổi delivered về pending
            if (order.status?.toLowerCase() === 'delivered' && status.toLowerCase() === 'pending') {
                return Response.json(
                    { error: "Cannot change delivered order back to pending" },
                    { status: 403 }
                );
            }
        }

        // ================================
        // CẬP NHẬT AN TOÀN VỚI findByIdAndUpdate
        // ================================
        
        const oldStatus = order.status;
        
        const updatedOrder = await Order.findByIdAndUpdate(
            _id,
            {
                status: status,
                ...otherData,  // Cho phép cập nhật thêm fields khác nếu cần
            },
            { 
                new: true,              // Trả về document đã update
                runValidators: true     // Chạy validators trong schema
            }
        );

        console.log(" Order status updated:", oldStatus, "→", updatedOrder.status);

        return Response.json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error(" PATCH Order Error:", error);
        return Response.json(
            { error: error.message || "Update failed" },
            { status: 500 }
        );
    }
}