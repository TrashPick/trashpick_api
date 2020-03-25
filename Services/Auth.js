const User = require('../Models/User');

module.exports = {
	signup: async ({ mobileNumber, password, country, mobileNetwork }) => {
		let user = new User({
			mobileNumber,
			mobileNetwork,
			country
		});

		user.generateID(mobileNumber);
		user.hashPassword(password);

		if (country === undefined) {
			return { error: { type: 'client', message: 'Please provide Country' } };
		} else if (mobileNetwork === undefined) {
			return {
				error: { type: 'client', message: 'Please provide Mobile Network' }
			};
		} else {
			try {
				await user.save();
				return {
					success: {
						type: 'authsuccess',
						message: 'User successfully registered',
						token: user.createWebToken()
					}
				};
			} catch (e) {
				if (e.code === 11000) {
					return {
						error: { type: 'client', message: 'Account already Exist' }
					};
				}
			}
		}
	},

	signin: async (phone, password) => {
		// Check db for phone number;
		let user = await User.findOne({ mobileNumber: phone });
		if (user !== null) {
			//User is in Db
			if (user.checkPassword(user.password)) {
				return {
					success: {
						type: 'authsuccess',
						message: 'User successfully registered',
						token: user.createWebToken()
					}
				};
			} else {
				return { error: { type: 'client', message: 'Invalid password' } };
			}
		} else {
			return { error: { type: 'client', message: 'Invalid Phone Number' } };
		}
	}
};
