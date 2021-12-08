const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        amount: {
          type: String,
        },
      },
    ],
    amount: { type: Number, require: true },
    deliveryInfo: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: {
        province: { type: String, default: "" },
        district: { type: String, default: "" },
        ward: { type: String, default: "" },
        street: { type: String, default: "" },
      },
      email: { type: String, default: "" },
    },
    isPaid: { type: Boolean, default: false },
    payment: {
      type: String,
      enum: ["COD", "PayPal"],
      default: "COD",
    },
    status: { type: String, default: "PENDING" },
    notes: { type: String, default: "" },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", OrderSchema);
