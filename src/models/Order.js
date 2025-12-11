import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
    name: String,
    userEmail: String,
    phone: String,
    streetAddress: String,
    postalCode: String,
    city: String,
    country: String,
    cartProducts: Object,
    status: {type: String, enum: ['pending', 'cancelled', 'delivered', 'delivering']},
    store: {type: Schema.Types.Mixed, required: false},
    drone: {type: Schema.Types.Mixed, require: false},
    paid: {type: Boolean, default: false},
    paymentMethod: {type: String, enum: ['offline', 'online']},
    note: String,
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema);