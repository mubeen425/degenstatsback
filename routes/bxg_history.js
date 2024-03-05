const express = require("express");
const config = require("config");
const { Bxg_token, validateS } = require("../models/bxg_token");
const { Bxg_history } = require("../models/bxg_history");
const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const getHistory = await Bxg_history.findAll();

    return res.send(getHistory);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/:wallet_address", async (req, res) => {
  console.log(req.params.wallet_address);
  try {
    if (!req.params.wallet_address) throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await Bxg_history.findAll({
      where: { wallet_address: req.params.wallet_address },
    });

    return res.send(getAllRequestsByUserId);
  } catch (error) {
    return res.send({ message: error.message });
  }
});
module.exports = router;