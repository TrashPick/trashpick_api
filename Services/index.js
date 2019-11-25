const { jwtSecret } = require('./config'),
	jwt = require('jsonwebtoken');

module.exports = {
	getUserDataToken: function(token) {
		return jwt.verify(token, jwtSecret);
	}
};
