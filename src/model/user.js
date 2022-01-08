const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
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
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    name: { type: String, default: "" },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);
