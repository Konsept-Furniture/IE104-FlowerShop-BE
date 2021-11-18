const mongoose = require("mongoose");

const PurchaseOrderSchema = new mongoose.Schema(
  {
    supplierId: { type: String, required: true },
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
    status: { type: String, default: "done" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
