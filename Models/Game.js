const { model, Schema } = require('mongoose');

const Game = new Schema({
	number: { type: Number },
	start: { type: Date, default: new Date() },
	end: { type: Date },
	winnerID: { type: String }
});

module.exports = model('Games', Game);
