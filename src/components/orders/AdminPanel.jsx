import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import UseProfile from "@/components/UseProfile";

export default function AdminPanel({ order, role }) {
    const { data: profile } = UseProfile();
    const roles = profile?.role;
    const [redirectToItems, setRedirectToItems] = useState(false);
    const [status, setStatus] = useState(order?.status || 'pending');
    const [selectedDrone, setSelectedDrone] = useState(order?.droneId || '');
    const [drones, setDrones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const { id } = useParams();

    // Load danh sách drones
    useEffect(() => {
        fetch('/api/drone')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Chỉ lấy drones available
                    const availableDrones = data.filter(d => d.status === 'available');
                    setDrones(availableDrones);
                } else {
                    setDrones([]);
                }
            })
            .catch(err => {
                console.error('Failed to load drones:', err);
                setDrones([]);
            });
    }, []);

    // Update status khi order thay đổi
    useEffect(() => {
        if (order) {
            setStatus(order.status || 'pending');
            setSelectedDrone(order.droneId || '');
        }
    }, [order]);

    // Handle Update Status
    async function handleUpdateStatus() {
        if (!status) {
            alert('Please select a status');
            return;
        }

        setUpdating(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: id,
                    status: status,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(' Status updated successfully!');
                window.location.reload();
            } else {
                alert(' ' + (data.error || 'Failed to update status'));
            }
        } catch (err) {
            alert(' Error: ' + err.message);
        } finally {
            setUpdating(false);
        }
    }

    // Handle Assign Drone
    async function handleAssignDrone() {
        if (!selectedDrone) {
            alert('Please select a drone');
            return;
        }

        setUpdating(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: id,
                    droneId: selectedDrone,
                    status: 'delivering', // Auto set to delivering
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(' Drone assigned successfully!');
                window.location.reload();
            } else {
                alert(' ' + (data.error || 'Failed to assign drone'));
            }
        } catch (err) {
            alert(' Error: ' + err.message);
        } finally {
            setUpdating(false);
        }
    }

    // Handle Delete Order
    async function handleDeleteClick() {
        if (!confirm('Are you sure you want to delete this order?')) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/orders?_id=' + id, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                alert(' Order deleted successfully!');
                window.location.href = '/orders';
            } else {
                alert(' ' + (data.error || 'Failed to delete order'));
            }
        } catch (err) {
            alert(' Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    // Status badges
    const getStatusBadge = (currentStatus) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            delivering: 'bg-blue-100 text-blue-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return badges[currentStatus?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Current Status Display */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Current Order Status</h3>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(order?.status)}`}>
                        {order?.status?.toUpperCase() || 'PENDING'}
                    </span>
                    {order?.droneId && (
                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                             Drone Assigned
                        </span>
                    )}
                </div>
            </div>

            {/* Update Status Section */}
            {(roles === 'admin' || roles === 'manager') && (
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">
                    <h3 className="font-semibold text-lg mb-4 text-blue-800">
                        📋 Update Order Status
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select New Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={updating}
                            >
                                <option value="pending">Pending</option>
                                <option value="delivering">Delivering</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <button
                            onClick={handleUpdateStatus}
                            disabled={updating || status === order?.status}
                            className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                updating || status === order?.status
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                            }`}
                        >
                            {updating ? '⏳ Updating...' : ' Update Status'}
                        </button>
                    </div>
                </div>
            )}

            {/* Assign Drone Section */}
            {(roles === 'admin' || roles === 'manager') && 
             order?.status !== 'delivered' && 
             order?.status !== 'cancelled' && (
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">
                    <h3 className="font-semibold text-lg mb-4 text-purple-800">
                         Assign Drone for Delivery
                    </h3>
                    
                    <div className="space-y-4">
                        {order?.droneId ? (
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <p className="text-sm text-purple-800 font-medium">
                                     Drone already assigned: <span className="font-bold">{order.droneId}</span>
                                </p>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Available Drone
                                    </label>
                                    <select
                                        value={selectedDrone}
                                        onChange={(e) => setSelectedDrone(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        disabled={updating}
                                    >
                                        <option value="">-- Select a drone --</option>
                                        {drones.length > 0 ? (
                                            drones.map((drone) => (
                                                <option key={drone._id} value={drone._id}>
                                                    {drone.name} ({drone.model}) - Battery: {drone.battery}%
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>No available drones</option>
                                        )}
                                    </select>
                                </div>

                                {drones.length === 0 && (
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                        <p className="text-sm text-yellow-800">
                                             No drones available at the moment
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleAssignDrone}
                                    disabled={updating || !selectedDrone || drones.length === 0}
                                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                        updating || !selectedDrone || drones.length === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95'
                                    }`}
                                >
                                    {updating ? '⏳ Assigning...' : ' Assign Drone & Start Delivery'}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    * Assigning a drone will automatically set status to "Delivering"
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Section - Admin Only */}
            {roles === 'admin' && (
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-red-200">
                    <h3 className="font-semibold text-lg mb-4 text-red-800">
                        🗑️ Danger Zone
                    </h3>
                    
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                             Only cancelled orders can be deleted. This action cannot be undone.
                        </p>
                        
                        <button
                            onClick={handleDeleteClick}
                            disabled={loading || order?.status !== 'cancelled'}
                            className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                loading || order?.status !== 'cancelled'
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                            }`}
                        >
                            {loading ? '⏳ Deleting...' : '🗑️ Delete Order'}
                        </button>

                        {order?.status !== 'cancelled' && (
                            <p className="text-xs text-red-500 text-center">
                                * Order must be cancelled before deletion
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}