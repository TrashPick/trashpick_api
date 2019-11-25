const http = require('http'),
	ws = require('websocket').server,
	PORT = process.env.PORT || 3030,
	//{ generatedNumber, newGame } = require('./Engine'),
	mongoose = require('mongoose'),
	//{ signup } = require('./Services/Auth');

var server = http.createServer().listen(PORT, () => {
	console.log('Server Started Successfully');
});

const clients = [];

var wbSocket = new ws({
	httpServer: server
});

(async () => {
	await mongoose.connect('mongodb://localhost:27017/Round10', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	console.log('Connected to Database Successfully');
})();

wbSocket.on('request', (request) => {
	var connection = request.accept(null, request.origin);
	clients.push(connection);

	console.log('Connection from ' + new Date() + ' ' + request.origin);

	connection.on('message', (message) => {
		clients.forEach((client) => {
			client.sendUTF(JSON.stringify(message));
		});
	});
});
