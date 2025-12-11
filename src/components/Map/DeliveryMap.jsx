'use client';
import dynamic from 'next/dynamic';

// Dùng dynamic import để tránh SSR
const LeafletMap = dynamic(() => import('./OrderMap'), {
  ssr: false, // chỉ render ở client
});

export default function DeliveryMap(props) {
  return <LeafletMap {...props} />;
}
