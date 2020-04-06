const { Router } = require('express');
const Pledge = require('../Services/Pledge');
const { getUserDataToken } = require('../Services');

const pledgeRoute = Router();

pledgeRoute.post('/newPledge', async (req, res) => {
	const mPledge = await Pledge.createNewPledge(req.body);
	res.send(mPledge);
});

pledgeRoute.get('/myPledges/:token', async (req, res) => {
	const { userID } = getUserDataToken(req.params.token);
	const mPledges = await Pledge.myPledges({ userID: userID });
	res.send(mPledges);
});

pledgeRoute.get('/pledge/:id', async (req, res) => {
	const pledge = await Pledge.getOnePledge(req.params);
	res.send(pledge);
});

pledgeRoute.post('/me/matchPledge/:pledgeID', async (req, res) => {
	const matchPledge = await Pledge.matchPledges({
		pledgeID: req.params.pledgeID
	});
	res.send(matchPledge);
});

pledgeRoute.get('/me/pledgeDetails/:pledgeID', async (req, res) => {
	const pledgeDetailsResponse = await Pledge.getPledgeDetails(req.params);
	res.status(pledgeDetailsResponse.status).send(pledgeDetailsResponse);
});

module.exports = pledgeRoute;
