const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    name: { type: String, required: true },
    location: { type: String, default: "" },
    img: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", SupplierSchema);
