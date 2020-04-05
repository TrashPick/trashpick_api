const Pledge = require('../Models/Pledge');
const User = require('../Models/User');
const Match = require('../Models/Match');
const { getUserDataToken } = require('../Services');

module.exports = {
	myPledges: async ({ userID }) => {
		const mPledges = await Pledge.find({ userID: userID }).sort({
			dateCreated: -1
		});
		return mPledges;
	},

	getOnePledge: async ({ id }) => {
		const mPledge = await Pledge.findById(id);
		return mPledge;
	},

	createNewPledge: async ({ token, amount }) => {
		const { userID } = getUserDataToken(token);
		const userDetails = await User.findOne({ userID: userID });
		//	console.log(userDetails);

		const creditCharged = amount * 0.2 * 10;
		console.log('Credits charged', creditCharged);
		if (userDetails.credits >= creditCharged) {
			const mPledge = new Pledge({
				amount,
				userID,
				expectedAmount: 0.8 * amount + amount,
				dateCreated: new Date().toUTCString(),
				amountLeftForMatch: 0.8 * amount + amount
			});

			await mPledge.save();

			await User.findOneAndUpdate(
				{ userID: userID },
				{ $inc: { credits: -creditCharged } }
			);

			return mPledge;
		} else {
			return 'Not enough credit balance';
		}
	},

	getPledgeDetails: async ({ pledgeID }) => {
		let currentPledge = await Pledge.findById(pledgeID);
		if (currentPledge === null) return 'pledge not found';

		let Pending = await Match.find({
			userID: currentPledge.userID,
			userPledgeID: pledgeID,
			acknowledged: false
		});

		let PastTransactions = await Match.find({
			userID: currentPledge.userID,
			userPledgeID: pledgeID,
			acknowledged: true
		});

		let IncomingFunds = await Match.find({
			pledgeID: pledgeID,
			acknowledged: false
		});

		return {
			status: 200,
			pending: Pending,
			past: PastTransactions,
			incoming: IncomingFunds
		};
	},

	matchPledges: async ({ pledgeID }) => {
		let currentPledge = await Pledge.findById(pledgeID);
		if (currentPledge === null) return 'pledge not found';

		let fulfilledPledgesAvailable = await Pledge.find({ fulfilled: false });
		//console.log('CurrentPledge', fulfilledPledgesAvailable);

		var AmountToMatch = currentPledge.amountLeftForMatch;
		console.log('Amount to match', AmountToMatch);

		for (var i = 0; i < fulfilledPledgesAvailable.length; i++) {
			const amountAvailabletoMatch =
				fulfilledPledgesAvailable[i].amount -
				fulfilledPledgesAvailable[i].matchedAmount;

			if (fulfilledPledgesAvailable[i].userID === currentPledge.userID)
				continue;

			if (amountAvailabletoMatch === 0) {
				continue;
			}

			console.log('Available', amountAvailabletoMatch);
			console.log('Remainder', AmountToMatch);
			console.log('Payable', amountAvailabletoMatch - AmountToMatch);

			if (AmountToMatch === 0) break;

			const match = new Match({
				to: currentPledge.userID,
				userID: fulfilledPledgesAvailable[i].userID,
				userPledgeID: fulfilledPledgesAvailable[i]._id,
				amountToPay:
					AmountToMatch <= amountAvailabletoMatch
						? AmountToMatch
						: amountAvailabletoMatch,
				date: new Date().toISOString(),
				acknowledged: false,
				pledgeID: pledgeID
			});

			const cP = await Pledge.findOneAndUpdate(
				{ _id: currentPledge._id },
				{
					$push: { usersMatch: match._id },
					$inc: {
						amountLeftForMatch:
							AmountToMatch <= amountAvailabletoMatch
								? -AmountToMatch
								: -amountAvailabletoMatch
					}
				}
			);

			await match.save();

			await Pledge.findOneAndUpdate(
				{ _id: fulfilledPledgesAvailable[i]._id },
				{
					$inc: {
						matchedAmount:
							AmountToMatch <= amountAvailabletoMatch
								? AmountToMatch
								: amountAvailabletoMatch
					}
				}
			);

			fulfilledPledgesAvailable = await Pledge.find({
				fulfilled: false
			});

			// AmountToMatch -= amountAvailabletoMatch;
			currentPledge = cP;
			AmountToMatch -= amountAvailabletoMatch;

			console.log('Amount Left', AmountToMatch);
		}

		const myNewMatch = await Pledge.findOne({ _id: pledgeID });

		if (myNewMatch.amountLeftForMatch === 0) {
			await await Pledge.findOneAndUpdate(
				{ _id: pledgeID },
				{
					matched: true
				}
			);
		}

		return myNewMatch;
	},

	acknowledgePayment: async ({ matchID, amount }) => {
		const match = await Match.findOne({ _id: matchID });

		const acknowledge = await Match.findByIdAndUpdate(
			{ _id: matchID },
			{
				amountPayed: amount,
				acknowledged: amount + match.amountPayed === match.amountToPay
			}
		);

		return acknowledge;
	}
};
