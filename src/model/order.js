const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

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
    status: { type: String, default: "pending" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

OrderSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Order", OrderSchema);
