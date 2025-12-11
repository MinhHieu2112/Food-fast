'use client';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Fix icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icon red cho store
const redStoreIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function RealMap({ address, city, selectedStore, setSelectedStore }) {
  const [stores, setStores] = useState([]);
  const [customerPos, setCustomerPos] = useState(null);
  const [route, setRoute] = useState([]);

  // Load all stores
  useEffect(() => {
    fetch("/api/store")
      .then((res) => res.json())
      .then((data) => setStores(data));
  }, []);

  // Convert address → coordinates
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

  // When customer position changes → find closest store
  useEffect(() => {
    if (!customerPos || stores.length === 0) return;

    const sorted = [...stores].map(store => {
      const { lat, lng } = store.address.coordinates;
      return {
        ...store,
        distance: distance(customerPos.lat, customerPos.lng, lat, lng),
      };
    }).sort((a, b) => a.distance - b.distance);

    setSelectedStore(sorted[0]); // chọn chi nhánh gần nhất
  }, [customerPos, stores]);

  // Fetch route from selected store → customer
  useEffect(() => {
    if (!selectedStore || !customerPos) return;

    const { lat, lng } = selectedStore.address.coordinates;
    const url = `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${customerPos.lng},${customerPos.lat}?overview=full&geometries=geojson`;

    axios.get(url).then(res => {
      const coords = res.data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      setRoute(coords);
    });
  }, [selectedStore, customerPos]);

  return (
    <div className="h-[350px] w-full rounded-xl overflow-hidden border">
      <MapContainer
        center={[10.7626, 106.6601]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* store markers */}
        {stores.map((store, i) => (
          <Marker
            key={i}
            position={[
              store.address.coordinates.lat,
              store.address.coordinates.lng
            ]}
            icon={redStoreIcon}
          >
            <Popup>
              <b>{store.name}</b><br />
              {store.address.street}, {store.address.city}
            </Popup>
          </Marker>
        ))}

        {/* customer marker */}
        {customerPos && (
          <Marker position={[customerPos.lat, customerPos.lng]}>
            <Popup>Khách hàng</Popup>
          </Marker>
        )}

        {/* route */}
        {route.length > 0 && (
          <Polyline positions={route} color="blue" />
        )}
      </MapContainer>
    </div>
  );
}
