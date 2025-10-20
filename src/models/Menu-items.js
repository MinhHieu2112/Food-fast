import { Schema, model, models } from "mongoose";

const ExtraPriceSchema = new Schema({
    name: String,
    price: String,
});

const MenuItemSchema = new Schema({
    image: {type: String},
    name: {type: String},
    description: {type: String},
    basePrice: {type: String},
    sizes: {type: [ExtraPriceSchema]},
    extraIngredientPrices: {type:[ExtraPriceSchema]},
}, {timestamps: true});

export const MenuItem = models?.MenuItem || model('MenuItem', MenuItemSchema)
