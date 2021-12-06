const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

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
    email: { type: String, default: "" },
    name: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("User", UserSchema);
