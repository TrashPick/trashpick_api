const { Schema, model } = require("mongoose");

const voucher = new Schema({
  serial: { type: String },
  voucherCode: { type: String, unique: true },
  dateCreated: { type: Number },
  amount: { type: Number },
  initialized: { type: Boolean, default: false },
  user: { type: String },
  dateInitialized: { type: Number },
  batchID: { type: Number },
});

module.exports = model("Vouchers", voucher);
