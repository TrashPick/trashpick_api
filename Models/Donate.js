const { Schema, model } = require("mongoose");

const donate = new Schema({
  type: { type: String, enum: ["food", "foodStuff", "money"] },
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
  amount: { type: Number },
  pickedUp: { type: Boolean, default: false },
  pickedUpDate: { type: String },
  donationDate: { type: String },
  date: { type: Number },
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
