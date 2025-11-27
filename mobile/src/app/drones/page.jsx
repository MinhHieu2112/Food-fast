'use client';
import useProfile from "@/components/UseProfile"
import {useEffect, useState} from "react"
import Link from "next/link"

export default function DronesPage() {

    const {loading, data} = useProfile();
    const [drones, setDrone] = useState([]);

    useEffect(() => {
        fetch('/api/drone').then(response => {
            response.json().then(drones => {
                setDrone(drones);
                });
            });
    }, []);

    if (loading) {
        return 'Loading drones info';
    }
    if (!data) {
        return 'Loading...'; // hoặc redirect / skeleton
    }

    if (!data.isAdmin) {
        return 'Not an admin';
    }

    return (
    <section className="max-w-2xl mx-auto mt-8">
        <div className="mt-8 text-sm">

            {/* Header */}
            <div className="grid grid-cols-4 font-semibold text-gray-700 border-b pb-3 mb-3 text-center">
                <div>Name</div>
                <div>Status</div>
                <div>Battery</div>
                <div></div> {/* Cột nút View */}
            </div>

            {/* Rows */}
            {drones?.length > 0 && drones.map(drone => (
                <div
                    key={drone._id}
                    className="grid grid-cols-4 bg-gray-100 rounded-lg mb-2 p-2 px-4 items-center text-center"
                >

                    {/* Drone Name */}
                    <div className="text-gray-700">
                        {drone.name || <span className="italic">No name</span>}
                    </div>

                    {/* Status */}
                    <div className="text-gray-500">
                        {drone.status}
                    </div>

                    {/* Battery */}
                    <div className="text-gray-500">
                        {drone.battery}
                    </div>

                    {/* View Button */}
                    <div>
                        <Link
                            className="btn-register bg-white text-sm hover:bg-gray-200 px-3 py-1 rounded-lg"
                            href={'/drones/' + drone._id}
                        >
                            View
                        </Link>
                    </div>

                </div>
            ))}

        </div>
    </section>
);
}