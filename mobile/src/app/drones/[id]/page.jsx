'use client';
import useProfile from "@/components/UseProfile"
import {useEffect, useState} from "react"
import {useParams} from "next/navigation"
import toast from "react-hot-toast"
import EditableImage from "@/components/layout/EditableImage"

export default function EditDronesPage() {
    const {loading, data} = useProfile();
    const {id} = useParams();
    const [drone, setDrone] = useState([]);
    const [image, setImage] = useState('');

    useEffect(() => {
        if (!id) return;
        fetch(`/api/drone?_id=${encodeURIComponent(id)}`)
        .then(res => res.json())
        .then(drone => setDrone(drone))
    }, [id]);

    if (loading) {
        return 'Loading drone profile ...';
    }

    if (!data) return 'No user data';

    if (!data.isAdmin) {
        return 'Not an admin';
    }

    if (!drone) {
        return 'Loading drone...';
    }

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