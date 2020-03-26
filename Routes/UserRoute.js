const { Router } = require('express');
const Auth = require('../Services/Auth');

const userRoute = Router();

userRoute.post('/auth/newuser', async (req, res) => {
	const response = await Auth.signup(req.body);
	// console.log(response);
	if (response.msg.type === 'success') {
		res.send(response.msg.token);
	} else {
		res.status(401).send(response.msg.message);
	}
});

userRoute.post('/auth/signin', async (req, res) => {
	const response = await Auth.signin(req.body);
	if (response.msg.type === 'success') {
		res.send(response.msg.token);
	} else {
		res.status(401).send(response.msg.message);
	}
});

module.exports = userRoute;
