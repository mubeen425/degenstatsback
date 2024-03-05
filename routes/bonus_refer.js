const express = require("express");
const config = require("config");
const { Bonus_refer, validatef } = require("../models/bonus_refer");

const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const getHistory = await Bonus_refer.findAll();

    return res.send(getHistory);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await Bonus_refer.findOne({
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

    const checkrefer = await Bonus_refer.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    // if (!checkrefer) throw new Error("Invalid Address.");

    // const getOtherReferals = await Bonus_refer.findOne({
    //   where: { wallet_address: req.body.refer_code },
    // });
    // if (!getOtherReferals) throw new Error("Invalid Reference Code.");

    if (checkrefer.isRefered) throw new Error("Already Refered.");
    if (req.body.refer_code === req.body.wallet_address){
      console.log("Entering in to the Invalid Reference Code. condition")
      throw new Error("Invalid Reference Code.");
    }
    checkrefer.isRefered = true;
    checkrefer.refer_code = req.body.refer_code;

    await checkrefer.save();
    return res.send("Refere Added Successfully.");
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});


router.post("/check", async (req, res) => {
  try {
    if (!req.body.wallet_address)
      throw new Error("wallet address is missing.");
    const checkWalletByUserId = await Bonus_refer.findOne({
      where: { wallet_address: req.body.wallet_address },
    });

    if (!checkWalletByUserId) return res.status(400).send({status:false,refer_code:req.body.wallet_address});

    return res.send({status:true,refer_code:checkWalletByUserId.wallet_address});
  } catch (error) {
    return res.send({status:false, message: error.message });
  }
});

module.exports = router;