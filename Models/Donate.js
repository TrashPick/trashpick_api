const { Schema, model } = require("mongoose");

const donate = new Schema({
  type: {
    type: String,
    enum: ["food", "foodStuff", "money", "clothing", "educational"],
  },
  user: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  mobileMoneyNetwork: { type: String },
  mobileNumber: { type: String },
  comment: { type: String },
  clothingType: { type: String, enum: ["new", "old"] },
  amount: { type: Number },
  landmark: { type: String },
  pickedUp: { type: Boolean, default: false },
  pickedUpDate: { type: String },
  donationDate: { type: String },
  date: { type: Number },
  courier: { type: String },
  address: { type: String },
  userNumber: { type: String },
  region: { type: String },
  status: {
    type: String,
    enum: ["pending", "enroute", "confirmed"],
    default: "pending",
  },
});

donate.index({ location: "2dsphere" });

module.exports = model("Donations", donate);
