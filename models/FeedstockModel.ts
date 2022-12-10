import mongoose, { Schema } from "mongoose";

const FeedstockSchema = new Schema({
  name: { type: String, required: true },
  coin: { type: Number, required: true, default: 0 },
  inventory: { type: Number, required: true, default: 0 }
});

export const FeedstockModel = (mongoose.models.feedstock || mongoose.model('feedstock', FeedstockSchema));