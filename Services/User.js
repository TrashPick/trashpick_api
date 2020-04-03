const User = require('../Models/User');
const { getUserDataToken } = require('../Services/index');

module.exports = {
	rechargeCredits: async ({ amount, momo, token, credits }) => {
		const { userID } = getUserDataToken(token);

		const currentAccount = await User.findOne({ userID: userID });
		if (currentAccount !== null) {
			try {
				await User.findOneAndUpdate(
					{ userID: userID },
					{ credits: currentAccount.credits + credits }
				);

				return {
					status: 200,
					message: `Successfully Recharged ${amount}, current balance is ${currentAccount.credits +
						credits}`
				};
			} catch (e) {
				return {
					status: 404,
					message: e
				};
			}
		} else {
			return {
				status: 404,
				message: 'User not Found'
			};
		}
	}
};

const convertAmountToCredits = (amount) => {
	return amount * 0.2 * 10;
};

const getServiceProvider = (mobileNumber) => {
	if (mobileNumber.length < 10) {
		return 'Invalid Number';
	}

	if (mobileNumber.length == 10) {
		const first3 = mobileNumber.substring(0, 3);
		if (first3 === '020' || first3 === '050') {
			return 'vodafone';
		}

		if (first3 === '024' || first3 === '054' || first3 === '059') {
			return 'mtn';
		}
	} else return 'Invalid Number';
};
