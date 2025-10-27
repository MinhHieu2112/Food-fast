// react-leaflet và leaflet chỉ chạy được trên client-side (trình duyệt).
// Next.js lại chạy trước trên server, nên khi nó gặp import { MapContainer... } from 'react-leaflet', nó báo lỗi: window is not defined
// Thay vì import trực tiếp, ta để Next.js import component bản đồ động (client-only).
'use client';
import dynamic from 'next/dynamic';

// Dùng dynamic import để tránh SSR
const LeafletMap = dynamic(() => import('./RealMap'), {
  ssr: false, // chỉ render ở client
});

export default function MapComponent(props) {
  return <LeafletMap {...props} />;
}
