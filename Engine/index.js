const Game = require('../Models/Game');

module.exports = {
	startGame: async () => {
		const currentGame = await Game.findOne({ status: 'active' }).sort({
			date: -1
		});

		console.log(currentGame);

		if (currentGame === null) {
			//Start a new Game
			return await newGame();
		} else {
			var now = new Date();
			var gameEndtime = new Date(currentGame.end);

			var diffMs = gameEndtime - now; // milliseconds between now & Christmas
			var minutesleft = parseInt(Math.abs((diffMs / (1000 * 60)) % 60)); // minutes
			//const minutesleft = gameEndtime.getMinutes() - now.getMinutes();
			const seconds = Math.floor((diffMs / 1000) % 60);
			console.log('Minutes', minutesleft);
			if (minutesleft >= 0 && seconds < 0) {
				console.log('Seconds', seconds);

				await Game.findByIdAndUpdate(currentGame._id, { status: 'end' });
				return await newGame();
			}

			return currentGame;
		}
	}
};
const newGame = async () => {
	console.log('Starting a new game');
	var game = new Game({ number: generatedNumber() });
	game.newGame(1);
	console.log(game);
	await game.save();
	return game;
};

const generatedNumber = function() {
	return Math.floor(Math.random(1) * 10);
};
