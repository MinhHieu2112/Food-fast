import { Schema, model, models } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

const StoreSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    address: {
        street: String,
        district: String,
        city: String,
        country: String,
        coordinates: { lat: Number, lng: Number }
    },
    phone: String,
    email: String,
  
    // Hoạt động
    status: { type: String, enum: ['active', 'inactive', 'maintenance'] },
    operatingHours: [{
      dayOfWeek: String, // 0-6
      openTime: String, // "08:00"
      closeTime: String, // "22:00"
    }],

    // Giao hàng
    deliveryZones: [{
      radius: Number, // km
      minOrder: Number,
      deliveryFee: Number
    }],
    availableDrones: [{ type: ObjectId, ref: "Drone" }],
  
}, {timestamps: true});

export const Store = models?.Store || model('Store', StoreSchema);