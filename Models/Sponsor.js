const { Schema, model } = require("mongoose");

const Sponsor = new Schema({
  imgUrl: { type: String },
  url: { type: String },
  name: { type: String },
  major: { type: Boolean, default: false },
});

module.exports = model("Sponsors", Sponsor);
