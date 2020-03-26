const { Schema, model } = require('mongoose');

const match = new Schema({
	userID: { type: String },
	amountToPay: { type: Number },
	amountPayed: { type: Number, default: 0 },
	date: { type: String },
	acknowledged: { type: Boolean, default: false },
	pledgeID: { type: String },
	userPledgeID: { type: String }
});

module.exports = model('Matches', match);
