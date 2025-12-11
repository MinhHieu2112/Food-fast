'use client';
import { useEffect, useState } from "react";
import { 
    BarChart, 
    Bar, 
    PieChart, 
    Pie, 
    Cell,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from "recharts";

export default function StatisticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Màu sắc cho từng store (vibrant colors)
    const COLORS = [
        '#FF6B6B', // Coral Red
        '#4ECDC4', // Turquoise
        '#45B7D1', // Sky Blue
        '#FFA07A', // Light Salmon
        '#98D8C8', // Mint Green
        '#F7DC6F', // Sunny Yellow
        '#BB8FCE', // Lavender
        '#85C1E2', // Light Blue
        '#F8B739', // Orange Yellow
        '#52B788', // Forest Green
    ];

    useEffect(() => {
        fetch('/api/statistic')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch statistics');
                return res.json();
            })
            .then(data => {
                console.log("📊 Statistics data:", data);
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Custom label for Pie Chart
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                className="font-bold text-sm"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Custom Tooltip for Pie Chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{payload[0].name}</p>
                    <p className="text-blue-600 font-bold">${payload[0].value.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                        {((payload[0].value / stats.totalRevenue) * 100).toFixed(1)}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center bg-red-50 p-8 rounded-xl border border-red-200">
                    <span className="text-5xl mb-4 block">⚠️</span>
                    <p className="text-xl text-red-600 font-semibold">Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <span className="text-6xl mb-4 block">📊</span>
                    <p className="text-xl text-gray-600">No data available</p>
                </div>
            </div>
        );
    }

    return (
        <section className="mt-8 max-w-7xl mx-auto px-4 pb-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Order Statistics
                </h1>
                <p className="text-gray-600 mt-2">Overview of your business performance</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
                        <span className="text-2xl">💰</span>
                    </div>
                    <p className="text-3xl font-bold">${stats.totalRevenue}</p>
                    <p className="text-xs opacity-75 mt-1">{stats.totalOrders} total orders</p>
                </div>

                {/* Delivered Orders */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">Delivered Orders</h3>
                        <span className="text-2xl">✅</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.statusCount.delivered}</p>
                    <p className="text-xs opacity-75 mt-1">Successfully completed</p>
                </div>

                {/* Pending Orders */}
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">Pending Orders</h3>
                        <span className="text-2xl">⏳</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.statusCount.pending}</p>
                    <p className="text-xs opacity-75 mt-1">Awaiting processing</p>
                </div>

                {/* Cancelled Orders */}
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">Cancelled Orders</h3>
                        <span className="text-2xl">❌</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.statusCount.cancelled}</p>
                    <p className="text-xs opacity-75 mt-1">Refunded or cancelled</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Pie Chart - Revenue Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span>🍰</span>
                        Revenue Distribution by Store
                    </h2>
                    
                    {stats.revenueByStore && stats.revenueByStore.length > 0 ? (
                        <div>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={stats.revenueByStore}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="revenue"
                                        animationBegin={0}
                                        animationDuration={800}
                                    >
                                        {stats.revenueByStore.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Legend */}
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {stats.revenueByStore.map((store, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors">
                                        <div 
                                            className="w-4 h-4 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                {store.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                ${store.revenue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <span className="text-6xl mb-4">📊</span>
                            <p>No revenue data available</p>
                        </div>
                    )}
                </div>

                {/* Bar Chart - Revenue Comparison */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span>📊</span>
                        Revenue Comparison
                    </h2>
                    
                    {stats.revenueByStore && stats.revenueByStore.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={stats.revenueByStore}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{ fontSize: 12 }}
                                    angle={-15}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip 
                                    formatter={(value) => `$${value.toFixed(2)}`}
                                    contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Legend />
                                <Bar 
                                    dataKey="revenue" 
                                    fill="#3b82f6" 
                                    name="Revenue ($)"
                                    radius={[8, 8, 0, 0]}
                                    animationBegin={0}
                                    animationDuration={800}
                                >
                                    {stats.revenueByStore.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <span className="text-6xl mb-4">📈</span>
                            <p>No revenue data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Status Summary */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span>📋</span>
                    Order Status Breakdown
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 transform hover:scale-105 transition-transform">
                        <span className="text-4xl mb-2 block">⏳</span>
                        <p className="text-sm text-gray-600 font-medium mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.statusCount.pending}</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 transform hover:scale-105 transition-transform">
                        <span className="text-4xl mb-2 block">🚁</span>
                        <p className="text-sm text-gray-600 font-medium mb-1">Delivering</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.statusCount.delivering}</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 transform hover:scale-105 transition-transform">
                        <span className="text-4xl mb-2 block">✅</span>
                        <p className="text-sm text-gray-600 font-medium mb-1">Delivered</p>
                        <p className="text-3xl font-bold text-green-600">{stats.statusCount.delivered}</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 transform hover:scale-105 transition-transform">
                        <span className="text-4xl mb-2 block">❌</span>
                        <p className="text-sm text-gray-600 font-medium mb-1">Cancelled</p>
                        <p className="text-3xl font-bold text-red-600">{stats.statusCount.cancelled}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}