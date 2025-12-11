'use client';
import useProfile from "@/components/UseProfile"
import {useEffect, useState, useRef} from "react"
import {useParams, useRouter} from "next/navigation"
import toast from "react-hot-toast"
import EditableImage from "@/components/layout/EditableImage"

export default function EditDronesPage() {
    const {loading, data} = useProfile();
    const {id} = useParams();
    const [drone, setDrone] = useState([]);
    const [image, setImage] = useState('');
    const router = useRouter();
    const toastId = useRef(null);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/drone?_id=${encodeURIComponent(id)}`)
        .then(res => res.json())
        .then(drone => setDrone(drone))
    }, [id]);

    // Show loading toast only once
    useEffect(() => {
    if (loading && !toastId.current) {
        toastId.current = toast.loading("Loading drone info...");
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
        <div 
            className="mt-8 max-w-2xl mx-auto">
            {/* Chia hàng ngang: UploadFile bên trái, form bên phải */}
            <div className="flex items-start gap-4">
                        {/* BÊN TRÁI: Upload ảnh */}
                        {/* <div className="w-1/3">
                            <EditableImage 
                                value= {image || ''} 
                                onUpload={setImage} 
                            />
                        </div> */}
            
                            {/* BÊN PHẢI: Thông tin drone */}
                        <div className="flex-1 flex-col gap-5">
                            <div>
                                <label>Drone Id</label>
                                <input type="text" value={drone._id || ''} readOnly/>
                            </div>
                            
                            <div>
                                <label>Name</label>
                                <input type="text" value={drone.name || ''} readOnly/>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                 <div>
                                    <label>Battery</label>
                                    <input type="text" value={drone.battery || ''} readOnly/>
                                </div>
                                <div>
                                    <label>Status</label>
                                    <input type="text" value={drone.status || ''} readOnly/>
                                </div>                                
                                <div>
                                    <label>Max Payload</label>
                                    <input type="text" value={drone.maxPayload || ''} readOnly/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div >
                                    <label>Lat</label>
                                    <input type="text" value={drone.location? 
                                            `${drone.location.lat}` : ''} readOnly/>
                                </div>
                                <div>
                                    <label>Lon</label>
                                    <input type="text" value={drone.location? 
                                            `${drone.location.lng}` : ''} readOnly/>
                                </div>
                            </div>
                            
                            <div>
                                <label>Current order Id</label>
                                <input type="text" value={drone.currentOrderId || 'None'} readOnly/>
                            </div>
                            
                            <div>
                                <label>Last active</label>
                                <input type="text" value={new Date(drone.lastActive).toLocaleString('vi-VN') || ''} readOnly/>
                            </div>
                        </div>
                </div>
        </div>
    )
}