const User = require("../Models/User");
const { getUserDataToken } = require("../Services");

module.exports = {
  signup: async ({
    mobileNumber,
    name,
    region,
    email,
    userType,
    donorType,
    password = "",
    clearance,
    organization,
  }) => {
    let user = new User({
      mobileNumber,
      name,
      region,
      email,
      userType,
      donorType,
      clearance,
      organization,
    });

    user.hashPassword(password);
    try {
      await user.save();

      return user;
    } catch (e) {
      if (e.code === 11000) {
        return "Already Exist";
      }
    }
  },

  signin: async ({ mobileNumber, password, type }) => {
    // Check db for phone number;

    let user = await User.findOne({ mobileNumber: mobileNumber });

    if (user !== null) {
      //User is in Db
      if (user.checkPassword(password)) {
        if (type !== user.clearance) {
          return {
            msg: { type: "error", message: "Invalid User type" },
          };
        }

        return {
          msg: {
            type: "success",
            user: user,
          },
        };
      } else {
        return {
          msg: { type: "invalidPassword", message: "Invalid password" },
        };
      }
    } else {
      return {
        msg: { type: "error", message: "Phone does not exist in databse" },
      };
    }
  },

  getUserData: async (userId) => {
    const userDatafromDatabase = await User.findOne({
      _id: userId,
    });

    if (userDatafromDatabase !== null) {
      return {
        status: 200,
        data: {
          name: userDatafromDatabase.name,
          mobileNumber: userDatafromDatabase.mobileNumber,
        },
      };
    } else {
      return {
        status: 404,
        data: "user not found",
      };
    }
  },
};
