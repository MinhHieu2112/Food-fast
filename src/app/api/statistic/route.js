import connectToDB from "@/libs/mongoConnect";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/User";

export async function GET(req) {
    try {
        await connectToDB();

        // Authentication check
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;

        if (!userEmail) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Authorization check - chỉ admin/manager
        const userInfo = await User.findOne({ email: userEmail });
        const userRole = userInfo?.role;

        if (!userRole || (userRole !== 'admin' && userRole !== 'manager')) {
            return Response.json(
                { error: "Forbidden - Admin or Manager only" },
                { status: 403 }
            );
        }

        //  Lấy orders dựa trên role
        let orders;
        
        if (userRole === 'admin') {
            // Admin thấy tất cả orders
            orders = await Order.find({});
        } else if (userRole === 'manager') {
            // Manager chỉ thấy orders của store mình
            const managerStoreId = userInfo.storeId?.toString();
            
            // Tìm orders có store._id hoặc store khớp với managerStoreId
            orders = await Order.find({
                $or: [
                    { 'store._id': managerStoreId },
                    { 'store.id': managerStoreId },
                    { 'store': managerStoreId }
                ]
            });
        }

        console.log("📊 Statistics - Found orders:", orders.length);

        // ================================
        // 📊 TÍNH TOÁN THỐNG KÊ
        // ================================

        // 1️⃣ Tính tổng doanh thu (chỉ đơn đã thanh toán hoặc delivered)
        let totalRevenue = 0;
        
        orders.forEach(order => {
            // Chỉ tính đơn đã paid hoặc delivered
            if (order.paid === true || order.status === 'delivered') {
                // Tính tổng từ cartProducts
                let orderTotal = 0;
                
                if (order.cartProducts && Array.isArray(order.cartProducts)) {
                    order.cartProducts.forEach(product => {
                        let productPrice = Number(product.basePrice) || 0;
                        
                        // Cộng giá size
                        if (product.size?.price) {
                            productPrice += Number(product.size.price) || 0;
                        }
                        
                        // Cộng giá extras
                        if (product.extras && Array.isArray(product.extras)) {
                            product.extras.forEach(extra => {
                                productPrice += Number(extra.price) || 0;
                            });
                        }
                        
                        orderTotal += productPrice;
                    });
                }
                
                // Cộng phí ship (nếu có)
                orderTotal += 5; // Delivery fee
                
                totalRevenue += orderTotal;
            }
        });

        // Doanh thu theo Store
        const revenueByStore = {};
        
        orders.forEach(order => {
            if (order.paid === true || order.status === 'delivered') {
                const storeName = order.store?.name || "Unknown Store";
                
                // Tính tổng cho order này
                let orderTotal = 0;
                
                if (order.cartProducts && Array.isArray(order.cartProducts)) {
                    order.cartProducts.forEach(product => {
                        let productPrice = Number(product.basePrice) || 0;
                        
                        if (product.size?.price) {
                            productPrice += Number(product.size.price) || 0;
                        }
                        
                        if (product.extras && Array.isArray(product.extras)) {
                            product.extras.forEach(extra => {
                                productPrice += Number(extra.price) || 0;
                            });
                        }
                        
                        orderTotal += productPrice;
                    });
                }
                
                orderTotal += 5; // Delivery fee
                
                if (!revenueByStore[storeName]) {
                    revenueByStore[storeName] = 0;
                }
                
                revenueByStore[storeName] += orderTotal;
            }
        });

        // Đếm số đơn theo trạng thái
        const statusCount = {
            pending: 0,
            delivering: 0,
            delivered: 0,
            cancelled: 0,
        };

        orders.forEach(order => {
            const status = order.status?.toLowerCase() || 'pending';
            
            if (status === 'pending') statusCount.pending++;
            else if (status === 'delivering') statusCount.delivering++;
            else if (status === 'delivered') statusCount.delivered++;
            else if (status === 'cancelled' || status === 'cancel') statusCount.cancelled++;
        });

        // 4️⃣ Format data cho chart
        const revenueByStoreArray = Object.entries(revenueByStore).map(([name, revenue]) => ({
            name,
            revenue: Number(revenue.toFixed(2))
        }));

        console.log("✅ Statistics calculated:");
        console.log("- Total Revenue:", totalRevenue);
        console.log("- Revenue by Store:", revenueByStore);
        console.log("- Status Count:", statusCount);

        return Response.json({
            success: true,
            totalRevenue: Number(totalRevenue.toFixed(2)),
            revenueByStore: revenueByStoreArray,
            statusCount,
            totalOrders: orders.length,
            role: userRole
        });

    } catch (error) {
        console.error(" Statistics API Error:", error);
        return Response.json(
            { error: error.message || "Failed to fetch statistics" },
            { status: 500 }
        );
    }
}