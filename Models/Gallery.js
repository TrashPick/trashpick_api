const { Schema, model } = require("mongoose");

const Gallery = new Schema({
  imgUrl: { type: String },
  description: { type: String },
  title: { type: String },
});

module.exports = model("Gallery", Gallery);
