'use client'
import { useState, useEffect} from "react";

export default function StoreForm({initialStore, onSubmit}) {
    const [name, setName] = useState(initialStore?.name || '');
    const [street, setStreet] = useState(initialStore?.address?.street || '');
    const [district, setDistrict] = useState(initialStore?.address?.district || '');
    const [city, setCity] = useState(initialStore?.address?.city || '');
    const [country, setCountry] = useState(initialStore?.address?.country || '');
    const [phone, setPhone] = useState(initialStore?.phone || '');
    const [email, setEmail] = useState(initialStore?.email || '');
    const [status, setStatus] = useState(initialStore?.status || 'active');
    const [day, setDay] = useState(initialStore?.operatingHours?.dayOfWeek || []);
    const [openTime, setOpenTime] = useState(initialStore?.operatingHours?.openTime || '08:00');
    const [closeTime, setCloseTime] = useState(initialStore?.operatingHours?.closeTime || '22:00');
    const [deliveryZones, setDeliveryZones] = useState(initialStore?.deliveryZones || '');
    const [lat, setLat] = useState(initialStore?.address?.coordinates?.lat || '');
    const [lng, setLng] = useState(initialStore?.address?.coordinates?.lng || '');
    const [radius, setRadius] = useState(initialStore?.deliveryZones?.radius || '');
    const [minOrder, setMinOrder] = useState(initialStore?.deliveryZones?.minOrder || '');
    const [deliveryFee, setDeliveryFee] = useState(initialStore?.deliveryZones?.deliveryFee || '');

    useEffect(() => {
        if (initialStore) {
            setName(initialStore.name || '');
            setStreet(initialStore.address?.street || '');
            setDistrict(initialStore.address?.district || '');
            setCity(initialStore.address?.city || '');
            setCountry(initialStore.address?.country || '');
            setPhone(initialStore.phone || '');
            setEmail(initialStore.email || '');
            setStatus(initialStore.status || 'active');
            setOpenTime(initialStore.operatingHours?.openTime || '08:00');
            setCloseTime(initialStore.operatingHours?.closeTime || '22:00');
            setDeliveryZones(initialStore.deliveryZones || '');
            setLat(initialStore.address?.coordinates?.lat || '');
            setLng(initialStore.address?.coordinates?.lng || '');
            setRadius(initialStore.deliveryZones?.radius || '');
            setMinOrder(initialStore.deliveryZones?.minOrder || '');
            setDeliveryFee(initialStore.deliveryZones?.deliveryFee || '');
        }
    }, [initialStore]);

    return (
        <form className="grow"
            onSubmit={ev => {
                onSubmit(ev, {
                    name, address: { street, district, city, country, coordinates: { lat, lng } },
                    phone, email, status,
                    operatingHours: { openTime, closeTime },
                    deliveryZones: { radius, minOrder, deliveryFee }
                });
            }} >
            <div>
            <label>Store Name</label>
            <input type="text" value={name} onChange={ev => setName(ev.target.value)} />

            <div className = "grid grid-cols-3 gap-2">
                <div>
                    <label>Street Address</label>
                    <input type="text" value={street} onChange={ev => setStreet(ev.target.value)} />
                </div>
                <div>
                    <label>District</label>
                    <input type="text" value={district} onChange={ev => setDistrict(ev.target.value)} />
                </div>
                <div>
                    <label>City</label>
                    <input type="text" value={city} onChange={ev => setCity(ev.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label>Latitude</label>
                    <input type="text" value={lat} onChange={ev => setLat(ev.target.value)} />
                </div>
                <div>
                    <label>Longitude</label>
                    <input type="text" value={lng} onChange={ev => setLng(ev.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label>Phone</label>
                    <input type="text" value={phone} onChange={ev => setPhone(ev.target.value)} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="text" value={email} onChange={ev => setEmail(ev.target.value)} />
                </div>
            </div>
            
            <div>
                <label>Country</label>
                <input type="text" value={country} onChange={ev => setCountry(ev.target.value)} />
            </div>

            <div>
                <label>Status</label>
                <select value={status} onChange={ev => setStatus(ev.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </div>
            {/* Add more fields for operating hours, delivery zones, coordinates as needed */}
            {/* <div>
                <label>Operating Hours - Day of Week (0-6)</label>
                <input type="text" value={day} onChange={ev => setDay(ev.target.value)} />
            </div> */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label>Open Time (HH:MM)</label>
                    <select value={openTime} onChange={ev => setOpenTime(ev.target.value)}>
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                        <option value="20:00">20:00</option>
                        <option value="21:00">21:00</option>
                        <option value="22:00">22:00</option>
                    </select>
                </div>
                <div>
                    <label>Close Time (HH:MM)</label>
                    <select value={closeTime} onChange={ev => setCloseTime(ev.target.value)}>
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                        <option value="20:00">20:00</option>
                        <option value="21:00">21:00</option>
                        <option value="22:00">22:00</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <label>Delivery Radius (km)</label>
                    <input type="text" value={radius} onChange={ev => setRadius(ev.target.value)} />
                </div>
                <div>
                    <label>Min Order</label>
                    <input type="text" value={minOrder} onChange={ev => setMinOrder(ev.target.value)} />
                </div>
                <div>
                    <label>Delivery Fee</label>
                    <input type="text" value={deliveryFee} onChange={ev => setDeliveryFee(ev.target.value)} />
                </div>
            </div>

            </div>
            <button className="bg-primary btn-register" type="submit">Save Store</button>
        </form>
    );
}