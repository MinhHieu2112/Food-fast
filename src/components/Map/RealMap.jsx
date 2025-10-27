'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import axios from "axios"; //định tuyến đường

//Bước 1 — Cấu hình icon mặc định của Leaflet
// Fix lỗi icon không hiện trong môi trường Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Khi customerPos thay đổi, map sẽ tự zoom 
// và canh khung nhìn bao trọn 2 điểm.
function RecenterMap({ restaurantPos, customerPos }) {
  const map = useMap();
  useEffect(() => {
    if (customerPos) {
      const bounds = L.latLngBounds([
        [restaurantPos.lat, restaurantPos.lng],
        [customerPos.lat, customerPos.lng],
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [customerPos]);
  return null;
}

export default function RealMap({ address, city }) {
  // Bước 2: Khởi tạo 
  const restaurantPos = {lat: 10.762622, lng: 106.660172}
  const [customerPos, setCustomerPos] = useState(null);
  const [route, setRoute] = useState([]);

  //Bước 3 — Geocoding: chuyển địa chỉ → tọa độ
  useEffect(() => {
    if(!address || !city) return;

    const query = encodeURIComponent(`${address}, ${city}, Vietnam`);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then (res => res.json())
      .then (data => {
        if (data && data.length > 0) {
          setCustomerPos({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        }
      })
      .catch(err => console.error('Geocoding error:', err));
  }, [address, city])

  // --- Bước 4: Gọi API OSRM để lấy tuyến đường thực
  useEffect(() => {
    if (!restaurantPos || !customerPos) return;

    const fetchRoute = async () => {
      const url = `https://router.project-osrm.org/route/v1/driving/${restaurantPos.lng},${restaurantPos.lat};${customerPos.lng},${customerPos.lat}?overview=full&geometries=geojson`;

      try {
        const res = await axios.get(url);
        const coords = res.data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
        setRoute(coords);
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [restaurantPos, customerPos]);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      {/* Bước 5 — Vẽ bản đồ */}
      <MapContainer
        center={[restaurantPos.lat, restaurantPos.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {/* Marker nhà hàng */}
        <Marker position={[restaurantPos.lat, restaurantPos.lng]}>
          <Popup>ST Pizza</Popup>
        </Marker>
        {/* Marker khách hàng */}
        {customerPos && (
          <>
            <Marker position={[customerPos.lat, customerPos.lng]}>
              <Popup>Client: {address}, {city}</Popup>
            </Marker>
            {/* Vẽ đường nối hai vị trí */}
            {route.length > 0 &&
              <Polyline
                positions={route}
               color="blue"
              />
            }
            <RecenterMap restaurantPos={restaurantPos} customerPos={customerPos} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
