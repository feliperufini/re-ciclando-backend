import mongoose, { Schema } from "mongoose";

const TradepointSchema = new Schema({
  title: { type: String, required: true },
  address: { type: String, required: true }
});

export const TradepointModel = (mongoose.models.tradepoint || mongoose.model('tradepoint', TradepointSchema));