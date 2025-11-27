'use client';
import { useEffect, useState } from 'react';

export default function DeliveryTimer({ orderId, initialMinutes }) {
    const STORAGE_KEY = `delivery_timer_${orderId}`;
    const DELIVERED_KEY = `delivery_status_${orderId}`; // Key lưu trạng thái delivered
  
    // Kiểm tra xem đơn hàng đã delivered chưa
    const [isDelivered, setIsDelivered] = useState(() => {
        if (typeof window === 'undefined') {
            return false
        };
            return localStorage.getItem(DELIVERED_KEY) === 'true';
    });

  // Khởi tạo endTime
  const [endTime, setEndTime] = useState(() => {
    if (typeof window === 'undefined') return null;
    
    // Nếu đã delivered thì không cần timer
    if (localStorage.getItem(DELIVERED_KEY) === 'true') {
      return null;
    }
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return parseInt(saved, 10);
    }
    
    const end = Date.now() + initialMinutes * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, end.toString());
    return end;
  });

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (isDelivered || !endTime) return;

    const calculateTimeLeft = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      
      // Khi hết giờ: đánh dấu delivered
      if (remaining === 0) {
        localStorage.setItem(DELIVERED_KEY, 'true');
        localStorage.removeItem(STORAGE_KEY);
        setIsDelivered(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, isDelivered, STORAGE_KEY, DELIVERED_KEY]);

  // Nếu đã delivered
  if (isDelivered) {
    return (
      <div>
        Delivered
      </div>
    );
  }

  // Đang đếm ngược
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}