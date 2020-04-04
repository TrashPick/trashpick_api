const { Schema, model } = require('mongoose');

const History = new Schema({
	action: { type: String },
	description: { type: String },
	userID: { type: String }
});

module.exports = model('History', History);
