const { model, Schema } = require('mongoose');
const crypto = require('crypto');
const { jwtSecret } = require('../Services/config');
const jwt = require('jsonwebtoken');

const User = new Schema({
	userID: { type: String, required: true },
	password: { hash: String, salt: String },
	mobileNumber: { type: Number, required: true },
	mobileNetwork: { type: String },
	country: { type: String },
	credits: { type: Number, default: 0.0 },
	username: { type: String }
});

User.methods.generateID = function(mobileNumber) {
	const genID = `U${mobileNumber}`;
	this.userID = genID;
};

User.methods.hashPassword = function(password) {
	this.password.salt = crypto.randomBytes(16).toString('hex');
	this.password.hash = crypto
		.pbkdf2Sync(password, this.password.salt, 1000, 512, 'sha512')
		.toString('hex');
};

User.methods.checkPassword = function(password) {
	let hash = crypto
		.pbkdf2Sync(password, this.password.salt, 1000, 512, 'sha512')
		.toString('hex');
	return hash === this.password.hash;
};

User.methods.createWebToken = function() {
	return jwt.sign(
		{
			userID: this.userID,
			mobileNumber: this.mobileNumber,
			mobileNetwork: this.mobileNetwork,
			country: this.country
		},
		jwtSecret
	);
};

module.exports = model('Users', User);
