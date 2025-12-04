
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    phone: {type: String},
    address: {type: String},
    postal: {type: String},
    city: {type: String},
    country: {type: String},
    // Role enum
    role: { 
        type: String,
        enum: ["customer", "manager", "admin"],
        default: "customer"
    }
}, {timestamps: true});

export const User = models?.User || model('User', UserSchema);