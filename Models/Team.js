const { Schema, model } = require("mongoose");

const Team = new Schema({
  imgUrl: { type: String },
  name: { type: String },
  email: { type: String },
  position: { type: String },
});

module.exports = model("Teams", Team);
