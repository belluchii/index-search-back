const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    listPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    isBestSeller: {
      type: Boolean,
      required: true,
    },
    boughtInLastMonth: {
      type: Number,
      required: true,
      min: 0,
    },
    category_name: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: false,
      index: true,
    },
  },
  { versionKey: false },
);

const Products = mongoose.model("Producto", productsSchema, "products");

module.exports = Products;
