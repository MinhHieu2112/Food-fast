'use client';
import { useEffect, useState } from 'react';

export default function DeliveryProgressTracker({ orderId, orderStatus, initialMinutes = 30 }) {
    const STORAGE_KEY = `delivery_timer_${orderId}`;
    const STAGE_KEY = `delivery_stage_${orderId}`;
    
    // Các giai đoạn với thời gian dự kiến (phần trăm)
    const stages = [
        { id: 'pending', label: 'Order Placed', icon: '📋', duration: 10 }, // 10% = 3 phút
        { id: 'preparing', label: 'Preparing', icon: '👨‍🍳', duration: 40 }, // 40% = 12 phút
        { id: 'delivering', label: 'On the way', icon: '🚁', duration: 40 }, // 40% = 12 phút
        { id: 'delivered', label: 'Delivered', icon: '✅', duration: 10 }   // 10% = 3 phút
    ];

    // State cho auto-progress (chỉ dùng khi orderStatus = pending)
    const [currentStage, setCurrentStage] = useState(() => {
        if (typeof window === 'undefined') return 0;
        
        // Nếu order đã có status khác pending, dùng status từ DB
        if (orderStatus && orderStatus !== 'pending') {
            const stageMap = {
                'pending': 0,
                'preparing': 1,
                'delivering': 2,
                'delivered': 3,
                'cancelled': -1
            };
            return stageMap[orderStatus.toLowerCase()] ?? 0;
        }
        
        // Nếu pending, check localStorage
        const saved = localStorage.getItem(STAGE_KEY);
        return saved ? parseInt(saved, 10) : 0;
    });

    const [endTime, setEndTime] = useState(() => {
        if (typeof window === 'undefined') return null;
        
        if (orderStatus === 'delivered' || orderStatus === 'cancelled') {
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
    const [progress, setProgress] = useState(0);

    // Auto-update stage dựa trên thời gian (CHỈ KHI orderStatus = pending)
    useEffect(() => {
        if (!endTime || orderStatus === 'delivered' || orderStatus === 'cancelled') {
            return;
        }

        // Nếu orderStatus đã có giá trị khác pending, KHÔNG auto-progress
        if (orderStatus && orderStatus !== 'pending') {
            return;
        }

        const calculateProgress = () => {
            const totalTime = initialMinutes * 60 * 1000;
            const elapsed = totalTime - (endTime - Date.now());
            const progressPercent = Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
            
            setProgress(progressPercent);
            
            const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeLeft(remaining);

            // Auto-change stage based on progress
            if (progressPercent < 10) {
                updateStage(0); // pending
            } else if (progressPercent < 50) {
                updateStage(1); // preparing
            } else if (progressPercent < 90) {
                updateStage(2); // delivering
            } else if (progressPercent >= 90) {
                updateStage(3); // delivered
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(STAGE_KEY);
            }
        };

        calculateProgress();
        const timer = setInterval(calculateProgress, 1000);

        return () => clearInterval(timer);
    }, [endTime, orderStatus, initialMinutes]);

    // Sync với orderStatus từ database
    useEffect(() => {
        if (orderStatus && orderStatus !== 'pending') {
            const stageMap = {
                'preparing': 1,
                'delivering': 2,
                'delivered': 3,
                'cancelled': -1
            };
            const newStage = stageMap[orderStatus.toLowerCase()];
            if (newStage !== undefined && newStage !== currentStage) {
                setCurrentStage(newStage);
                localStorage.setItem(STAGE_KEY, newStage.toString());
            }
        }
    }, [orderStatus]);

    const updateStage = (newStage) => {
        if (newStage !== currentStage) {
            setCurrentStage(newStage);
            if (typeof window !== 'undefined') {
                localStorage.setItem(STAGE_KEY, newStage.toString());
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getCurrentStageIndex = () => {
        // Ưu tiên orderStatus từ database
        if (orderStatus && orderStatus !== 'pending') {
            const stageMap = {
                'pending': 0,
                'preparing': 1,
                'delivering': 2,
                'delivered': 3,
                'cancelled': -1
            };
            return stageMap[orderStatus.toLowerCase()] ?? currentStage;
        }
        return currentStage;
    };

    const activeStageIndex = getCurrentStageIndex();

    // Cancelled UI
    if (orderStatus === 'cancelled') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">❌</span>
                    <div>
                        <h3 className="text-lg font-bold text-red-800">Order Cancelled</h3>
                        <p className="text-sm text-red-600">This order has been cancelled</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div >
            {/* Header with Timer */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Delivery Progress</h3>
                {activeStageIndex < 3 && timeLeft > 0 && (
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                        <span className="text-sm text-gray-600">Est. Time: </span>
                        <span className="text-lg font-bold text-blue-600">{formatTime(timeLeft)}</span>
                    </div>
                )}
                {activeStageIndex === 3 && (
                    <div className="bg-green-50 px-4 py-2 rounded-lg">
                        <span className="text-sm font-bold text-green-600">✅ Completed</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="relative">
                {/* Background Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                    {/* Animated Progress Line */}
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                            width: `${(activeStageIndex / (stages.length - 1)) * 100}%` 
                        }}
                    />
                </div>

                {/* Stages */}
                <div className="relative flex justify-between">
                    {stages.map((stage, index) => {
                        const isCompleted = index < activeStageIndex;
                        const isCurrent = index === activeStageIndex;
                        const isPending = index > activeStageIndex;

                        return (
                            <div key={stage.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                                {/* Icon Circle */}
                                <div 
                                    className={`
                                        w-12 h-12 rounded-full flex items-center justify-center text-2xl
                                        transition-all duration-500 transform
                                        ${isCompleted 
                                            ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg scale-100' 
                                            : isPending
                                            ? 'bg-gray-200 scale-90'
                                            : 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg scale-110'
                                        }
                                        ${isCurrent ? 'ring-4 ring-blue-300 animate-pulse' : ''}
                                    `}
                                >
                                    {stage.icon}
                                </div>

                                {/* Label */}
                                <div className="mt-3 text-center">
                                    <p className={`
                                        text-sm font-semibold transition-colors duration-300
                                        ${isCompleted || isCurrent ? 'text-gray-800' : 'text-gray-400'}
                                    `}>
                                        {stage.label}
                                    </p>
                                    {isCurrent && activeStageIndex < 3 && (
                                        <p className="text-xs text-blue-600 mt-1 animate-pulse font-medium">
                                            In Progress...
                                        </p>
                                    )}
                                    {isCompleted && (
                                        <p className="text-xs text-green-600 mt-1 font-medium">
                                            ✓ Done
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Status Message */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                {activeStageIndex === 0 && (
                    <p className="text-sm text-gray-700">
                        🔔 Your order has been received and is being confirmed...
                    </p>
                )}
                {activeStageIndex === 1 && (
                    <p className="text-sm text-gray-700">
                        👨‍🍳 Our kitchen is preparing your delicious meal with care!
                    </p>
                )}
                {activeStageIndex === 2 && (
                    <p className="text-sm text-gray-700">
                        🚁 Your order is on the way! The drone is flying to your location.
                    </p>
                )}
                {activeStageIndex === 3 && (
                    <p className="text-sm text-green-700 font-semibold">
                        ✅ Your order has been delivered! Enjoy your meal! 🍕
                    </p>
                )}
            </div>

            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
                    <div>DB Status: {orderStatus || 'null'}</div>
                    <div>Current Stage: {activeStageIndex} ({stages[activeStageIndex]?.id})</div>
                    <div>Progress: {progress.toFixed(1)}%</div>
                    <div>Time Left: {timeLeft}s</div>
                </div>
            )}
        </div>
    );
}