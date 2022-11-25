import mongoose, { Schema } from "mongoose";

const FeedstockSchema = new Schema({
  name: { type: String, required: true },
  coin: { type: Number, required: true, default: 0 },
  inventory: { type: Number, required: true, default: 0 },
  trade: [{
    userId: { type: String },
    amount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  }]
});

export const FeedstockModel = (mongoose.models.feedstock || mongoose.model('feedstock', FeedstockSchema));