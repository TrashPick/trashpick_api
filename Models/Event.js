const { Schema, model } = require("mongoose");

const Event = new Schema({
  imgUrl: { type: String },
  description: { type: String },
  title: { type: String },
});

module.exports = model("Events", Event);
