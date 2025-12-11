"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function StoreRevenueChart({ data }) {
    const chartData = Object.keys(data).map(storeName => ({
        store: storeName,
        revenue: data[storeName],
    }));

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Revenue by Store</h2>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <XAxis dataKey="store" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
