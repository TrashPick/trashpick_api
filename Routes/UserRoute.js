const { Router } = require('express');
const Auth = require('../Services/Auth');
const { getUserDataToken } = require('../Services');
const { rechargeCredits, getUser } = require('../Services/User');
const { acknowledgePayment } = require('../Services/Pledge');

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
	} else if (response.msg.type === 'invalidPassword') {
		res.status(401).send(response.msg.message);
	} else {
		res.status(404).send(response.msg.message);
	}
});

userRoute.post('/pledge/acknowledge', async (req, res) => {
	await acknowledgePayment(req.body);
	res.send('acknowledged');
});

userRoute.post('/auth/me', async (req, res) => {
	const userData = await Auth.getUserData(req.body.token);
	res.status(userData.status).send(userData.data);
});

userRoute.post('/me/recharge', async (req, res) => {
	const rechargeResults = await rechargeCredits(req.body);
	res.status(rechargeResults.status).send(rechargeResults.message);
});

userRoute.get('/userDetails/:userID', async (req, res) => {
	const userDetailsResponse = await getUser(req.params);
	res.status(userDetailsResponse.status).send(userDetailsResponse.data);
});

module.exports = userRoute;
