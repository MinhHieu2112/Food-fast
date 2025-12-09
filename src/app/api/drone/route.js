import {Drone} from "@/models/Drone";
import { Order } from "@/models/Order";
import connectToDB from "@/libs/mongoConnect"

export async function POST(req) {
    try {
        await connectToDB();
        const data = await req.json();

        const newDrone = await Drone.create(data);

        return Response.json(newDrone, { status: 200 });

    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const _id = searchParams.get('_id');

        // --- GET ONE ---
        if (_id) {
            const drone = await Drone.findById(_id);

            if (!drone) {
                return Response.json({ error: "Drone not found" }, { status: 404 });
            }
            
            return Response.json(drone);
        }

        // --- GET ALL ---
        const drones = await Drone.find().sort({ createdAt: -1 });

        return Response.json(drones);

    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}
