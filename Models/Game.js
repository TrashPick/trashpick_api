const { model, Schema } = require('mongoose');

const { addMinutes } = require('../Utils');

const Game = new Schema({
	number: { type: Number },
	start: { type: Date, default: new Date().getTime() },
	end: { type: Date },
	winnerID: { type: String },
	players: { type: Array },
	status: {
		type: String,
		enum: ['active', 'ended', 'suspended', 'full'],
		default: 'active'
	}
});

Game.methods.newGame = function(minutes) {
	this.end = addMinutes(this.start, minutes);
	this.players = [];
};

module.exports = model('Games', Game);
