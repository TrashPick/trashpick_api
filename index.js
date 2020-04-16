const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const AuthRoute = require("./Routes/UserRoute");

const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(AuthRoute);

const mongoLocal = "mongodb://localhost:27017/BlackSanta";
const mongoUrl =
  "mongodb+srv://lionshare:LwAdUlakGh4A5Ijw@blogsandservices-zehed.mongodb.net/BlackSanta?retryWrites=true&w=majority";
// "LwAdUlakGh4A5Ijw"
(async () => {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to Database Successfully");
})();

app.listen(PORT, () => {
  console.log("Server started successfully");
});

// const mInterval = setInterval(async () => {
// 	await initiliseNewGametoClients();
// }, 10000);

// (async () => {
// 	currentGame = await startGame();
// 	//await initiliseNewGametoClients();
// 	mInterval;
// })();

// const initiliseNewGametoClients = async () => {
// 	console.log(currentGame);
// 	var diffMs = currentGame.end - new Date(); // milliseconds between now & Christmas

// 	const minutes = parseInt(Math.abs((diffMs / (1000 * 60)) % 60)); // minutes
// 	const seconds = Math.floor((diffMs / 1000) % 60);

// 	const time = {
// 		minutes,
// 		seconds
// 	};
// 	console.log(time);

// 	const cGame = {
// 		start: currentGame.start,
// 		end: currentGame.start,
// 		_id: currentGame._id
// 	};

// 	if (seconds < 0) {
// 		// clearInterval(mInterval);
// 		// // mInterval;
// 		// currentGame = await startGame();
// 		clients.forEach((client) => {
// 			client.sendUTF(
// 				JSON.stringify({
// 					type: 'game',
// 					data: currentGame,
// 					time: { minutes: 0, seconds: 0 },
// 					timeout: true
// 				})
// 			);
// 		});
// 	} else {
// 		clients.forEach((client) => {
// 			client.sendUTF(
// 				JSON.stringify({
// 					type: 'game',
// 					data: cGame,
// 					time
// 				})
// 			);
// 		});
// 	}
// };

// wbSocket.on('request', async (request) => {
// 	var connection = request.accept(null, request.origin);
// 	clients.push(connection);

// 	console.log('Connection from ' + new Date() + ' ' + request.origin);

// 	// await initiliseNewGametoClients();

// 	connection.on('message', (message) => {
// 		clients.forEach((client) => {
// 			client.sendUTF(JSON.stringify(message));
// 		});
// 	});
// });
