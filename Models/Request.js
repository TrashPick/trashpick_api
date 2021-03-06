const { Schema, model } = require("mongoose");

const Request = new Schema({
  date: { type: String },
  address: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  delivered: { type: Boolean, default: false },
  deliveryDate: { type: Number },
  courier: { type: String },
  user: { type: String },
  mealType: { type: String, enum: ["breakfast", "lunch", "supper"] },
  status: {
    type: String,
    enum: ["pending", "preparing", "enroute", "delivered"],
    default: "pending",
  },
  additionalNote: { type: String },
  landmark: { type: String },
  region: { type: String },
  userNumber: { type: String },
});

Request.index({ location: "2dsphere" });

module.exports = model("Requests", Request);
