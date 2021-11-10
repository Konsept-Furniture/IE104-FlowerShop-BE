const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const mongoosePaginate = require("mongoose-paginate-v2");

const randomPopular = Math.floor(Math.random() * 1000);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    countInStock: { type: Number, default: 0 },
    countRating: { type: Number, default: 1 },
    rating: { type: String, default: "5.0" },
    popular: { type: String, default: randomPopular },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});


ProductSchema.plugin(mongoosePaginate);



module.exports = mongoose.model("Product", ProductSchema);
