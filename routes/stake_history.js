const express = require("express");
const moment = require("moment");
const { StakeBxg, validateS } = require("../models/stake");
const { StakeHistory } = require("../models/stake_history");
const router = express.Router();
router.get("/getall", async (req, res) => {
  try {
    const getHistory = await StakeHistory.findAll();

    return res.send(getHistory);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await StakeHistory.findAll({
      where: { wallet_address: req.params.wallet_address },
    });

    return res.send(getAllRequestsByUserId);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

module.exports = router;
