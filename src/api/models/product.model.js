import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  thumbnail: { type: String, required: true },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  status: { type: String, required: true },
  stock: { type: String, required: true },
});

productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(productCollection, productSchema);
