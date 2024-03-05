const express = require("express");
const config = require("config");
const { Refers, validatef } = require("../models/refers");

const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const getHistory = await Refers.findAll();

    return res.send(getHistory);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await Refers.findOne({
      where: { wallet_address: req.params.wallet_address },
    });
    if (!getAllRequestsByUserId) return res.send({});

    return res.send(getAllRequestsByUserId);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validatef(req.body);
    if (error) throw new Error(error.details[0].message);

    const checkrefer = await Refers.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    if (!checkrefer) throw new Error("Invalid Wallet.");

    if (checkrefer.isRefered) throw new Error("Already Refered.");
    checkrefer.isRefered = true;

    // const getOtherReferals = await Refers.findOne({
    //   where: { wallet_address: req.body.refer_code },
    // });
    // if (!getOtherReferals) throw new Error("Invalid Reference Code.");
    if (req.body.refer_code === req.body.wallet_address)
      throw new Error("Invalid Reference Code.");
    checkrefer.refer1 = req.body.refer_code;
    checkrefer.refer2 = "";
    checkrefer.refer3 = "";
    // checkrefer.refer2 = getOtherReferals.refer1;
    // checkrefer.refer3 = getOtherReferals.refer2;

    const updatedrefer = await checkrefer.save();
    return res.send({ status: true, data: updatedrefer });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

router.post("/check", async (req, res) => {
  try {
    const { error } = validatef(req.body);
    if (error) throw new Error(error.details[0].message);

    const checkrefer = await Refers.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    if (!checkrefer) throw new Error("Invalid Wallet.");

    if (checkrefer.isRefered) throw new Error("Already Refered.");
    checkrefer.isRefered = true;

    const getOtherReferals = await Refers.findOne({
      where: { wallet_address: req.body.refer_code },
    });
    if (!getOtherReferals) throw new Error("Invalid Reference Code.");
    if (req.body.refer_code === req.body.wallet_address)
      throw new Error("Invalid Reference Code.");
    checkrefer.refer1 = req.body.refer_code;
    checkrefer.refer2 = getOtherReferals.refer1;
    checkrefer.refer3 = getOtherReferals.refer2;

    return res.send({data:{refer1:checkrefer.refer1,
      refer2:checkrefer.refer2,
      refer3:checkrefer.refer3,} });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

module.exports = router;
