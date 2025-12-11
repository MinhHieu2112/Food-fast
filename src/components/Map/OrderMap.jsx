'use client'
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// RED ICON STORE
const redStoreIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// BLUE ICON CUSTOMER
const customerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function OrderMap({ address, city, storeId }) {
  const [store, setStore] = useState(null);
  const [customerPos, setCustomerPos] = useState(null);
  const [route, setRoute] = useState([]);

  // Load đúng 1 cửa hàng theo storeId
  useEffect(() => {
    if (!storeId) return;

    fetch(`/api/store?_id=${storeId}`)
      .then(res => res.json())
      .then(data => setStore(data));
  }, [storeId]);

  // Convert địa chỉ khách → tọa độ
  useEffect(() => {
    if (!address || !city) return;

    const query = encodeURIComponent(`${address}, ${city}, Vietnam`);

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then(res => res.json())
      .then(data => {
        if (data?.length > 0) {
          setCustomerPos({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        }
      });
  }, [address, city]);

  // Vẽ đường đi: store → customer
  useEffect(() => {
    if (!store || !customerPos) return;

    const { lat, lng } = store.address.coordinates;

    const url = `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${customerPos.lng},${customerPos.lat}?overview=full&geometries=geojson`;

    axios.get(url).then(res => {
      const coords = res.data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      setRoute(coords);
    });
  }, [store, customerPos]);

  return (
    <div className="h-[350px] w-full rounded-xl overflow-hidden border mt-3">
      <MapContainer
        center={[10.7626, 106.6601]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Store Marker */}
        {store && (
          <Marker
            position={[
              store.address.coordinates.lat,
              store.address.coordinates.lng
            ]}
            icon={redStoreIcon}
          >
            <Popup>
              <b>{store.name}</b><br />
              {store.address.street}
            </Popup>
          </Marker>
        )}

        {/* Customer Marker */}
        {customerPos && (
          <Marker position={[customerPos.lat, customerPos.lng]} icon={customerIcon}>
            <Popup>Customer Address</Popup>
          </Marker>
        )}

        {/* Route */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
}
