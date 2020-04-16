const { Schema, model } = require("mongoose");

const donate = new Schema({
  type: { type: String, enum: ["food", "water", "cash"] },
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
});

donate.index({ geoLocation: "2dsphere" });

module.exports = model("Donations", donate);
