'use client';
import useProfile from "@/components/UseProfile"
import {useEffect, useState, useRef} from "react"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link"

export default function DronesPage() {

    const {loading, data} = useProfile();
    const [drones, setDrone] = useState([]);
    const router = useRouter();
    const toastId = useRef(null);

    useEffect(() => {
        fetch('/api/drone').then(response => {
            response.json().then(drones => {
                setDrone(drones);
                });
            });
    }, []);

    // Show loading toast only once
    useEffect(() => {
    if (loading && !toastId.current) {
        toastId.current = toast.loading("Loading drones info...");
    }
    if (!loading && toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
    }
    }, [loading]);

    // Allowed roles
    const allowed = ["admin", "manager"];

    // Handle unauthorized access
    useEffect(() => {
    if (!loading && data) {
        if (!allowed.includes(data.role)) {
        toast.error("You do not have access!");
        router.push("/");
        }
    }
    }, [loading, data, router]);

    // Avoid rendering until authorized
    if (loading) return null;
    if (!data || !allowed.includes(data.role)) return null;

    return (
    <section className="max-w-2xl mx-auto mt-8">
        <div className="mt-8 text-sm">
            <div className="overflow-x-auto rounded-xl">
                <table className="w-full border-collapse text-center">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Battery</th>
                            <th className="py-3 px-4">Detail</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {/* Rows */}
                        {drones?.length > 0 && drones.map(drone => (
                            <tr
                                key={drone._id}
                                className="border-t hover:bg-gray-50 transition-colors"
                            >
                                {/* Drone Name */}
                                <td className="py-3 px-4">
                                    {drone.name || <span className="italic">No name</span>}
                                </td>
                                {/* Status */}
                                <td className="py-3 px-4">
                                    {drone.status}
                                </td>
                                {/* Battery */}
                                <td className="py-3 px-4">
                                    {drone.battery}
                                </td>
                                {/* View Button */}
                                <td className="py-3 px-4">
                                    <Link
                                        className="btn-register bg-white text-sm hover:bg-gray-200 px-3 py-1 rounded-lg"
                                        href={'/drones/' + drone._id}
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    </section>
);
}