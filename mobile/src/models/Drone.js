import { Schema, model, models } from "mongoose";

const DroneSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'delivering', 'charging', 'maintenance', 'offline'],
        default: 'available',
    },
    battery: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
    },
    maxPayload: { 
        type: Number, 
        default: 0 
    },
    location: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
    },
    currentOrderId: { 
        type: Schema.Types.ObjectId, 
        ref: "Order",
        default: null
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
}, {timestamps: true});

export const Drone = models?.Drone || model('Drone', DroneSchema);