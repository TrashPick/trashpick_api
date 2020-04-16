const { Router } = require("express");
const Auth = require("../Services/Auth");
const { getUserDataToken } = require("../Services");
const {
  rechargeCredits,
  getUser,
  donate,
  getDonations,
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

userRoute.post("/auth/signin", async (req, res) => {
  const response = await Auth.signin(req.body);
  if (response.msg.type === "success") {
    res.send(response.msg.token);
  } else if (response.msg.type === "invalidPassword") {
    res.status(401).send(response.msg.message);
  } else {
    res.status(404).send(response.msg.message);
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
