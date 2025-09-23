import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
    expense: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  { timestamps: true, toJSON: { getters: true } }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;