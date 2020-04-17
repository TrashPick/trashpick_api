const { model, Schema } = require("mongoose");
const crypto = require("crypto");
const { jwtSecret } = require("../Services/config");
const jwt = require("jsonwebtoken");

const User = new Schema({
  mobileNumber: { type: Number, required: true, unique: true },
  name: { type: String },
  region: { type: String },
  email: { type: String },
  donorType: { type: String },
  organization: { type: String },
  userType: { type: String },
  password: { salt: { type: String }, hash: { type: String } },
  clearance: {
    type: String,
    enum: ["user", "delivery", "admin"],
    default: "user",
  },
});

User.methods.hashPassword = function (password) {
  this.password.salt = crypto.randomBytes(16).toString("hex");
  this.password.hash = crypto
    .pbkdf2Sync(password, this.password.salt, 1000, 512, "sha512")
    .toString("hex");
};

User.methods.checkPassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.password.salt, 1000, 512, "sha512")
    .toString("hex");
  return hash === this.password.hash;
};

User.methods.createWebToken = function () {
  return jwt.sign(
    {
      name: this.name,
      mobileNumber: this.mobileNumber,
      email: this.email,
      userType: this.userType,
      organisationEmail: organisationEmail,
    },
    jwtSecret
  );
};

module.exports = model("Users", User);
