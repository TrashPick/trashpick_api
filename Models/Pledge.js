const { Schema, model } = require('mongoose');

const Pledge = new Schema({
	amount: { type: Number, required: true },
	matchedAmount: { type: Number, default: 0 },
	expectedAmount: { type: Number },
	amountLeftForMatch: { type: Number },
	fulfilled: { type: Boolean, default: false },
	amountPayed: { type: Number },
	userID: { type: String },
	dateCreated: { type: String },
	matched: { type: Boolean, default: false },

	usersMatch: []
});

module.exports = model('Pledges', Pledge);
