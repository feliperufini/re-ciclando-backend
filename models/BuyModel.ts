import mongoose, { Schema } from "mongoose";

const BuySchema = new Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  coin: { type: Number, required: true },
  deliver: { type: Boolean, required: true, default: false },
  date: { type: Date, default: Date.now }
});

export const BuyModel = (mongoose.models.buy || mongoose.model('buy', BuySchema));