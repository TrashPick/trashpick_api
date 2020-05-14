const Donate = require("../Models/Donate");
const Request = require("../Models/Request");
const Voucher = require("../Models/Voucher");

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

  createVoucher: async ({ amount, serial, voucherCode }) => {
    const voucher = new Voucher({
      serial: serial,
      voucherCode: voucherCode,
      dateCreated: new Date().getTime(),
      amount: amount,
    });

    return await voucher.save();
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
        console.log(v);
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
