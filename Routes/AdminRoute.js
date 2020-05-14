const Router = require("express");
const AdminServices = require("../Services/Admin");
const adminRoute = Router();

adminRoute.get("/admin/donations", async (req, res) => {
  const results = await AdminServices.getDonations();
  //console.log(results);
  res.send(results);
});

adminRoute.get("/admin/requests", async (req, res) => {
  const results = await AdminServices.getRequests();
  res.send(results);
});

adminRoute.post("/admin/generateVouchers", async (req, res) => {
  console.log(req.body);
  const genResults = AdminServices.generateVoucher(req.body);
  if (genResults) {
    res.send("Done");
  } else {
    res.status(404).send("Error occured");
  }
});

adminRoute.get("/admin/vouchers", async (req, res) => {
  const vouchersResult = await AdminServices.getVouchers();
  res.send(vouchersResult);
});

module.exports = adminRoute;
