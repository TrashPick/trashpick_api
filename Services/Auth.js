const User = require('../Models/User');

module.exports = {
	signup: async ({
		mobileNumber,
		password,
		country,
		mobileNetwork,
		profileImage,
		username,
		firstname,
		lastname
	}) => {
		let user = new User({
			mobileNumber,
			mobileNetwork,
			country,
			profileImage,
			username,
			firstname,
			lastname
		});

		user.generateID(mobileNumber);
		user.hashPassword(password);

		if (country === undefined) {
			return {
				msg: { type: 'error', message: 'Please provide Country', code: 401 }
			};
		} else if (mobileNetwork === undefined) {
			return {
				msg: {
					type: 'error',
					message: 'Please provide Mobile Network',
					code: 401
				}
			};
		} else {
			try {
				await user.save();
				return {
					msg: {
						code: 200,
						type: 'success',
						message: 'User successfully registered',
						token: user.createWebToken()
					}
				};
			} catch (e) {
				if (e.code === 11000) {
					return {
						msg: { type: 'error', code: 401, message: 'Account already Exist' }
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
			if (user.checkPassword(password)) {
				return {
					msg: {
						type: 'success',
						message: 'User successfully registered',
						token: user.createWebToken()
					}
				};
			} else {
				return { msg: { type: 'error', message: 'Invalid password' } };
			}
		} else {
			return {
				msg: { type: 'error', message: 'Phone does not exist in databse' }
			};
		}
	}
};
