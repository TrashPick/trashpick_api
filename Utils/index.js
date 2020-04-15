const axios = require("axios").default;
const https = require("https");
var reverseGeo = new require("reverse-geocoding-google");

module.exports = {
  addMinutes: function (oldDate, minutes) {
    return new Date(oldDate.getTime() + minutes * 60000);
  },

  sendSMS: async ({ phone, message }) => {
    console.log("Phone: ", phone);
    console.log("Message:", message);
    const link = `https://apps.mnotify.net/smsapi?key=YaQmbKOoQrVpQ04xeZGiEx5td&to=${phone}&msg=${message}&sender_id=LiONSHARE`;
    try {
      const agent = new https.Agent({ rejectUnauthorized: false });
      const response = await axios.get(link, { httpsAgent: agent });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  makePayment: async ({ amount, phoneNumber }) => {
    const data = {
      price: amount,
      network: "mtn",
      recipient_number: "0206377510",
      sender: phoneNumber,
      apikey: "f487d6e16b776b526f9483e68e8d57f31b2eb0f6",
      option: "rmtv",
    };

    const paymentResponse = await axios.post(
      "https://client.teamcyst.com/api_call.php",
      data
    );
    console.log(paymentResponse.data);

    return paymentResponse.data;
  },

  reverseGeocoding: async (lat, long) => {
    const config = {
      latitude: lat,
      longitude: long,
      key: "AIzaSyBhSrQofzwdj-EjiCLB4szek-NvF6-jNtI",
    };

    return new Promise((resolve, reject) => {
      reverseGeo.location(config, function (err, data) {
        if (!err) {
          // console.log(data.results);

          if (data.results[1] === undefined) {
            resolve("--");
          } else {
            resolve(data.results[1].formatted_address);
          }
        } else {
          reject(err);
        }
      });
    });
  },
};
