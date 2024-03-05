const express = require("express");
const config = require("config");
const { Bxg_token, validateS } = require("../models/bxg_token");
const { Bxg_history } = require("../models/bxg_history");
const { Bonus_refer } = require("../models/bonus_refer");
const { BonusReferReward } = require("../models/bonus_refer_reward");
const { Op } = require("sequelize");
const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const getHistory = await Bxg_token.findAll();

    return res.send(getHistory);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await Bxg_token.findOne({
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
    const { error } = validateS(req.body);
    if (error) throw new Error(error.details[0].message);

    const bxgt = await Bxg_token.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    const bonusrefer = await Bonus_refer.findOne({
      where: {
        wallet_address: req.body.wallet_address,
      },
    });

    if (req.body.bxg <= 0) throw new Error("Invalid Bxg Amount");
    req.body.bxg = parseFloat(req.body.bxg);
    if (bonusrefer?.isRefered) {
      const bxghist = await Bxg_history.findAll({
        where: {
          [Op.and]: [
            { wallet_address: req.body.wallet_address },
            { type: "Bought" },
          ],
        },
      });
      if (bxghist.length === 0) {
        const calreward = req.body.usdt * 0.10;
        const brr = await BonusReferReward.create({
          wallet_address: req.body.wallet_address,
          refer_code: bonusrefer.refer_code,
          reward: calreward,
        });
      }
    }

    bxgt.bxg += req.body.bxg;
    console.log(bxgt.bxg);
    req.body.type = "Bought";
    await bxgt.save();
    await Bxg_history.create(req.body);
    return res.send("Purchasing Successfull.");
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    if (!req.body.bxg) throw new Error("Bxg value missing");

    const bxgt = await Bxg_token.findOne({
      where: { wallet_address: req.body.wallet_address },
    });

    if (!bxgt) throw new Error("Bxg not found.");
    let bxg = parseFloat(req.body.bxg);
    if (bxg <= 0 || bxg > bxgt.bxg) throw new Error("Invalid Bxg Value.");

    bxgt.bxg -= bxg;
    await bxgt.save();

    req.body.type = "pending";

    await Bxg_history.create(req.body);
    return res.status(200).send("Sold Successfuly.");
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  console.log('ok');
  try {
    const checkUser = await Bxg_token.findOne({ where: { id: req.params.id } });
    if (!checkUser)
      throw new Error("User Not Found With The Given Id.");

  await Bxg_token.update(
      { ...req.body },
      { returning: true, where: { id: req.params.id } }
    );
    return res.send("updated");
  } catch (error) {
   return res.send({status:false,message:error.message})
  }
});

router.put("/updated/:id",async(req,res)=>{
  console.log('ok');
  try {
    const checkUser = await Bxg_token.findOne({ where: { id: req.params.id } });
    if (!checkUser)
      throw new Error("User Not Found With The Given Id.");

  await Bxg_token.update(
      { ...req.body },
      { returning: true, where: { id: req.params.id } }
    );
    return res.send("updated");
  } catch (error) {
   return res.send({status:false,message:error.message})
  }
})

module.exports = router;
