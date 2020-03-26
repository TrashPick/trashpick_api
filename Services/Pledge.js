const Pledge = require('../Models/Pledge');
const User = require('../Models/User');
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

		const creditCharged = amount * 0.2;
		console.log('Credits charged', creditCharged);
		if (userDetails.credits >= creditCharged) {
			const mPledge = new Pledge({
				amount,
				userID,
				expectedAmount: 0.6 * amount + amount,
				dateCreated: new Date().toUTCString(),
				amountLeftForMatch: 0.6 * amount + amount
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
			const match = {
				userID: fulfilledPledgesAvailable[i].userID,
				amountToPay:
					AmountToMatch <= amountAvailabletoMatch
						? AmountToMatch
						: amountAvailabletoMatch,
				date: new Date().toISOString(),
				acknowledged: false
			};

			const cP = await Pledge.findOneAndUpdate(
				{ _id: currentPledge._id },
				{
					$push: { usersMatch: match },
					$inc: {
						amountLeftForMatch:
							AmountToMatch <= amountAvailabletoMatch
								? -AmountToMatch
								: -amountAvailabletoMatch
					}
				}
			);

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

	acknowledgePayment: async ({ pledgeID, userID }) => {}
};
