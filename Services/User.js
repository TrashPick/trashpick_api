const User = require("../Models/User");
const Donate = require("../Models/Donate");
const Request = require("../Models/Request");
const { getUserDataToken } = require("../Services/index");
const { sendSMS, makePayment, reverseGeocoding } = require("../Utils");

module.exports = {
  getUser: async ({ userID }) => {
    const user = await User.findOne({ _id: userID });

    if (user !== null) {
      return {
        status: 200,
        data: {
          ...user,
        },
      };
    } else {
      return {
        status: 404,
        data: "User not found",
      };
    }
  },

  Newrequest: async ({
    mealType,
    user,
    location,
    landmark,
    address,
    region,

    additionalNote,
    mobileNumber,
  }) => {
    let reversedAddress;

    try {
      if (address === undefined) {
        reversedAddress = await reverseGeocoding(location.lat, location.long);
      } else {
        reversedAddress = address;
      }
    } catch (e) {
      reversedAddress = region;
    }

    const request = new Request({
      mealType,
      user,
      landmark,
      additionalNote,
      location: {
        type: "Point",
        coordinates:
          location.lat !== undefined || location.lat !== undefined
            ? [location.long, location.lat]
            : [0, 0],
      },

      address: reversedAddress,
      date: new Date().getTime(),
      region,
    });

    console.log(request);

    try {
      await request.save();
      await sendSMS({
        phone: "+233" + mobileNumber,
        message:
          "Order has been received, The food will be delivered to you shortly, Thank for using Black Santa, We care for you",
      });
    } catch (e) {
      console.log(e);
    }
  },

  donate: async ({
    type,
    user,
    location,
    amount = 0,
    landmark,
    mobileMoneyNetwork,
    mobileNumber,
    address,
    userNumber,
    region,
  }) => {
    let reversedAddress;

    try {
      if (address === undefined) {
        reversedAddress = await reverseGeocoding(location.lat, location.long);
      } else {
        reversedAddress = address;
      }
    } catch (e) {
      reversedAddress = region;
    }

    const donation = new Donate({
      type,
      mobileMoneyNetwork,
      mobileNumber,
      address: reversedAddress,
      user,
      amount,
      region,
      landmark,
      userNumber,
      location: {
        type: "Point",
        coordinates:
          location.lat !== undefined || location.lat !== undefined
            ? [location.long, location.lat]
            : [0, 0],
      },
      donationDate: new Date().toLocaleString(),
      date: new Date().getTime(),
    });

    if (type == "money") {
      const requestPayment = await makePayment({
        amount: amount,
        phoneNumber: mobileNumber,
        network: mobileMoneyNetwork,
      });

      if (requestPayment.code === 1) {
        await donation.save();
        await sendSMS({
          phone: "+233" + userNumber,
          message:
            "We have recieved your donation towards the Black Santa Covid-19 SOS project. You just saved someone's life. Thank you",
        });
        return "Successfull";
      }
    } else {
      await donation.save();
      await sendSMS({
        phone: "+233" + userNumber,
        message:
          "We have received your request to donate toward the Black Santa Covid-19 SOS project. We'll assign our Delivery man for the package. Thank you",
      });
      return "Successfull";
    }
  },

  getDonations: async ({ userID }) => {
    const Donations = await Donate.find({ user: userID }).sort({ date: -1 });

    return Donations;
  },

  getMyRequests: async ({ userID }) => {
    const Requests = await Request.find({ user: userID }).sort({
      date: -1,
    });
    return Requests;
  },

  rechargeCredits: async ({ amount, momo, token, credits }) => {
    const { userID } = getUserDataToken(token);

    const currentAccount = await User.findOne({ userID: userID });
    if (currentAccount !== null) {
      try {
        const paymentResponse = await makePayment({
          amount: amount,
          phoneNumber: momo,
        });

        if (paymentResponse.code == 1) {
          await User.findOneAndUpdate(
            { userID: userID },
            { credits: currentAccount.credits + credits }
          );

          await sendSMS({
            phone: "+233" + currentAccount.mobileNumber,
            message: `Your Lionshare account has been credited with ${credits} points`,
          });

          return {
            status: 200,
            message: `Successfully Recharged ${amount}, current balance is ${
              currentAccount.credits + credits
            }`,
          };
        } else {
          return {
            status: 404,
            message: e,
          };
        }
      } catch (e) {
        return {
          status: 404,
          message: e,
        };
      }
    } else {
      return {
        status: 404,
        message: "User not Found",
      };
    }
  },
};

const convertAmountToCredits = (amount) => {
  return amount * 0.2 * 10;
};

const getServiceProvider = (mobileNumber) => {
  if (mobileNumber.length < 10) {
    return "Invalid Number";
  }

  if (mobileNumber.length == 10) {
    const first3 = mobileNumber.substring(0, 3);
    if (first3 === "020" || first3 === "050") {
      return "vodafone";
    }

    if (first3 === "024" || first3 === "054" || first3 === "059") {
      return "mtn";
    }
  } else return "Invalid Number";
};
