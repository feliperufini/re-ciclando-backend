import mongoose, { Schema } from "mongoose";

const TradeSchema = new Schema({
  userId: { type: String },
  feedstockId: { type: String },
  amount: { type: Number, default: 0 },
  coin: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

export const TradeModel = (mongoose.models.trade || mongoose.model('trade', TradeSchema));