import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: {type : String, required : true},
  description: {type : String, required : true},
  coast: {type : Number, required : true, default : 1},
  inventory: {type : Number, required : true, default : 0},
  photo: {type : String, required : false},
});

export const ProductModel = (mongoose.models.product || mongoose.model('product', ProductSchema));