const Donate = require("../Models/Donate");
const Request = require("../Models/Request");
const Voucher = require("../Models/Voucher");
const Gallery = require("../Models/Gallery");
const User = require("../Models/User");
const Events = require("../Models/Event");
const Sponsor = require("../Models/Sponsor");
const Team = require("../Models/Team");

const { donate } = require("../Services/User");

module.exports = {
  getDonations: async () => {
    const Donations = await Donate.find().sort({ date: -1 });
    /// console.log(Donations);
    return Donations;
  },

  getRequests: async () => {
    const Requests = await Request.find().sort({ _id: -1 });
    return Requests;
  },

  allUsers: async () => {
    const users = await User.find({});
    return users;
  },

  createVoucher: async ({ amount, serial, voucherCode }) => {
    const voucher = new Voucher({
      serial: serial,
      voucherCode: voucherCode,
      dateCreated: new Date().getTime(),
      amount: amount,
    });

    return await voucher.save();
  },

  initializeVoucher: async ({ voucherCode, user }) => {
    const voucher = await Voucher.findOne({ voucherCode: voucherCode });
    // console.log(voucher);
    if (voucher == null) {
      return {
        status: 404,
      };
    } else if (voucher.initialized) {
      return {
        status: 401,
      };
    } else {
      await await Voucher.findOneAndUpdate(
        { voucherCode: voucherCode },
        { initialized: true, dateInitialized: new Date().getTime(), user: user }
      );

      const uFind = await User.findById(user);

      await donate({
        type: "voucher",
        amount: voucher.amount,
        voucherSerial: voucher.serial,
        userNumber: uFind.mobileNumber,
        user: user,
        location: { lat: 0, long: 0 },
      });
      return { status: 200 };
    }
  },

  generateVoucher: async ({ amount, quatity, batchID = generate(5) }) => {
    for (let i = 0; i < Number(quatity); i++) {
      const voucher = new Voucher({
        serial: generate(12),
        voucherCode: generate(14),
        dateCreated: new Date().getTime(),
        batchID,
        amount: Number(amount),
      });
      try {
        const v = await voucher.save();
        // console.log(v);
      } catch (e) {
        console.log(e);
        continue;
      }
    }

    return true;
  },

  getVouchers: async () => {
    const vouchers = await Voucher.find().sort({ dateCreated: -1 });
    return vouchers;
  },

  addImage: async ({ imgUrl, description, title }) => {
    const gallery = new Gallery({
      imgUrl,
      description,
      title,
    });

    return await gallery.save();
  },

  getGalleryImages: async () => {
    return await Gallery.find();
  },

  deleteGalleryImage: async (id) => {
    return Gallery.findOneAndDelete({ _id: id });
  },

  addEvent: async ({ imgUrl, description, title }) => {
    const event = new Events({
      imgUrl,
      description,
      title,
    });

    return await event.save();
  },

  getEvents: async () => {
    return await Events.find();
  },

  deleteEvent: async (id) => {
    return Events.findOneAndDelete({ _id: id });
  },

  addTeam: async ({ name, imgUrl, email, position }) => {
    const team = new Team({
      name,
      imgUrl,
      email,
      position,
    });

    return await team.save();
  },

  getTeam: async () => {
    return await Team.find();
  },

  deleteTeam: async (id) => {
    return Team.findOneAndDelete({ _id: id });
  },

  addSponsor: async ({ imgUrl, url, name, major }) => {
    const sponsor = new Sponsor({
      imgUrl,
      url,
      name,
      major,
    });

    return await sponsor.save();
  },

  getSponsors: async () => {
    return await Sponsor.find();
  },

  deleteSponsor: async (id) => {
    return Sponsor.findOneAndDelete({ _id: id });
  },
};

function generate(n) {
  var add = 1,
    max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
}
