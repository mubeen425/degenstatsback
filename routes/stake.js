const express = require("express");
const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
const { Bxg_token } = require("../models/bxg_token");
const { Refers } = require("../models/refers");
const { ReferReward } = require("../models/refer_reward");
const { StakeBxg, validateS } = require("../models/stake");
const { StakeHistory } = require("../models/stake_history");
const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const getHistory = await StakeBxg.findAll();

    return res.send(getHistory);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await StakeBxg.findOne({
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

    const bxgt_stake = await StakeBxg.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    const bxg = await Bxg_token.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    if (!bxg) throw new Error("No Bxg Found In User Account.");
    const stkrefer = await Refers.findOne({
      where: { wallet_address: req.body.wallet_address },
    });

    req.body.bxg = parseFloat(req.body.bxg);

    if (req.body.bxg <= 0) throw new Error("Invalid StakeBxg Amount");
    // if (req.body.bxg > bxg.bxg) throw new Error("Insufficient Bxg Amount.");

    if (!bxgt_stake) {
      if (stkrefer?.isRefered) {
        const stkhist = await StakeHistory.findAll({
          where: { wallet_address: req.body.wallet_address },
        });
        if (stkhist.length === 0) {
          const lev1reward = req.body.bxg * 0.007;
          const lev2reward = req.body.bxg * 0.002;
          const lev3reward = req.body.bxg * 0.001;

          if (stkrefer.refer1) {
            await ReferReward.create({
              wallet_address: req.body.wallet_address,
              refer_code: stkrefer.refer1,
              level: 1,
              reward: lev1reward,
            });
          }

          if (stkrefer.refer2) {
            await ReferReward.create({
              wallet_address: req.body.wallet_address,
              refer_code: stkrefer.refer2,
              level: 2,
              reward: lev2reward,
            });
          }

          if (stkrefer.refer3) {
            await ReferReward.create({
              wallet_address: req.body.wallet_address,
              refer_code: stkrefer.refer3,
              level: 3,
              reward: lev3reward,
            });
          }
        }
      }
      await StakeBxg.create(req.body);
      bxg.bxg -= parseFloat(req.body.bxg);
      await bxg.save();
    } else {
      bxgt_stake.bxg += parseFloat(req.body.bxg);
      bxg.bxg -= parseFloat(req.body.bxg);
      // stake_time = moment().format("YYYY-MM-DD HH:mm:ss");
      await bxg.save();
      await bxgt_stake.save();
    }

    req.body.type = "Stake";
    const stkh = await StakeHistory.create(req.body);

    // const bs = await StakeBxg.findOne({
    //   where: { wallet_address: req.body.wallet_address },
    // });

    return res.send(stkh);
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!req.body.bxg) throw new Error("Bxg value missing");

    const stkhist = await StakeHistory.findOne({
      where: { id: req.params.id },
    });
    if (!stkhist) throw new Error("Invalid update id.");

    const bxgt_stake = await StakeBxg.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    const bxgt = await Bxg_token.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    if (!bxgt) throw new Error("No Bxg Found In User Account.");

    if (!bxgt_stake) throw new Error("Bxg stake not found.");
    let bxg = parseFloat(req.body.bxg);
    if (bxg <= 0 || bxg > bxgt_stake.bxg) throw new Error("Invalid Bxg Value.");

    // stkhist.type = "Staked";
    stkhist.stake_time=Sequelize.literal('CURRENT_TIMESTAMP')
    // bxgt_stake.bxg -= bxg;
    req.body.reward = bxg * 0.03;
    // bxgt.bxg += bxg + req.body.reward;
    bxgt.bxg += req.body.reward;  //UPDATE
    bxgt_stake.total_claim_reward += req.body.reward;
    await bxgt.save();
    await bxgt_stake.save();
    await stkhist.save();
    const updstk = await StakeHistory.create(req.body);

    if (req.body.type == "claim") {
      const findRefered = await ReferReward.findAll({
        where: {
          [Op.and]: [
            { wallet_address: req.body.wallet_address },
            { type: "pending" },
          ],
        },
      });

       for (const re of findRefered) {
        const getReferedBxg = await Bxg_token.findOne({
          where: { wallet_address: re.refer_code },
        });
        if (!getReferedBxg) {
          await Bxg_token.create({
            wallet_address: re.refer_code,
            bxg: re.reward,
          });
          re.type = "claimed";
          await re.save();
        } else {
          getReferedBxg.bxg += parseFloat(re.reward);
          await getReferedBxg.save();
          re.type = "claimed";
          await re.save();
        }
      }
    }


    return res.status(200).send(updstk);
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

module.exports = router;
