const { Schema, model } = require("mongoose");

const Sponsor = new Schema({
  imgUrl: { type: String },
  url: { type: String },
  name: { type: String },
});

module.exports = model("Sponsors", Sponsor);
