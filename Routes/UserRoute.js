const { Router } = require("express");
const Auth = require("../Services/Auth");
const { getUserDataToken } = require("../Services");
const {
  rechargeCredits,
  getUser,
  donate,
  getDonations,
  Newrequest,
  getMyRequests,
  getDonationsAndRequest,
  confirmRequestDelivery,
  confirmItemDelivered,
  confirmPickupDonation,
  confirmDonationPickup,
  getCourierRequestsAndDonationList,
} = require("../Services/User");
//const { acknowledgePayment } = require("../Services/Pledge");

const userRoute = Router();

userRoute.post("/auth/newuser", async (req, res) => {
  const response = await Auth.signup(req.body);

  if (response !== "Already Exist") {
    res.send(response);
  } else {
    res.status(401).send(response);
  }
});

userRoute.post("/user/donate", async (req, res) => {
  // console.log(req.body);
  const response = await donate(req.body);

  res.send("Successful");
});

userRoute.post("/user/newRequest", async (req, res) => {
  const request = await Newrequest(req.body);
  res.send("Done");
});

userRoute.get("/me/myRequests/:userID", async (req, res) => {
  const mRequests = await getMyRequests({
    userID: req.params.userID,
  });

  res.send(mRequests);
});

userRoute.post("/auth/signin", async (req, res) => {
  const response = await Auth.signin(req.body);

  if (response.msg.type === "success") {
    res.send(response.msg.user);
  } else if (response.msg.type === "invalidPassword") {
    res.status(401).send(response.msg.message);
  } else {
    res.status(404).send(response.msg.message);
  }
});

userRoute.get(
  "/donation/confirmForDelivery/:id/:courierID",
  async (req, res) => {
    const result = await confirmRequestDelivery(req.params);
    res
      .status(result.status)
      .send(result.status === 200 ? result.data : "Error");
  }
);

userRoute.get(
  "/donation/confirmDonationPickup/:id/:courierID",
  async (req, res) => {
    const result = await confirmDonationPickup(req.params);
    //console.log(result);
    res
      .status(result.status)
      .send(result.status === 200 ? result.data : "Error");
  }
);

userRoute.get("/donation/confirmDelivery/:id", async (req, res) => {
  console.log("hi");
  const result = await confirmItemDelivered(req.params);
  res.status("delivered");
});

userRoute.get("/donation/confirmPickup/:id", async (req, res) => {
  const result = await confirmPickupDonation(req.params);
  res.send("pickedup");
});

userRoute.get("/courier/job/:id", async (req, res) => {
  // console.log(req.params);
  const joblist = await getCourierRequestsAndDonationList(req.params);
  res.send(joblist);
});

userRoute.get("/requestAndDonations/:lat/:long", async (req, res) => {
  try {
    const requestAndDonations = await getDonationsAndRequest({
      lat: req.params.lat,
      long: req.params.long,
    });
    res.send(requestAndDonations);
  } catch (e) {
    res.status(404).send([]);
  }
});

userRoute.get("/auth/me/:userID", async (req, res) => {
  const userData = await Auth.getUserData(req.params.userID);

  res.status(userData.status).send(userData.data);
});

userRoute.get("/me/donations/:userID", async (req, res) => {
  const requestsAndDonations = await getDonations({
    userID: req.params.userID,
  });

  res.send(requestsAndDonations);
});

userRoute.post("/me/recharge", async (req, res) => {
  const rechargeResults = await rechargeCredits(req.body);
  res.status(rechargeResults.status).send(rechargeResults.message);
});

userRoute.get("/userDetails/:userID", async (req, res) => {
  const userDetailsResponse = await getUser(req.params);
  res.status(userDetailsResponse.status).send(userDetailsResponse.data);
});

module.exports = userRoute;
