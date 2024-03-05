const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");
const { Refers } = require("../models/refers");
const { Bonus_refer } = require("../models/bonus_refer");
const { Bxg_token } = require("../models/bxg_token");
const { Profile } = require("../models/profile");


router.post("/", async (req, res) => {
  try {
    const { error } = hashvalidate(req.body);
    if (error) throw new Error(error.details[0].message);

     const profile = await Profile.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    if (profile) {
      if (profile.converted)
        throw new Error(
          "Your account is transferred to the new version. Please login there to continue."
        );
    }

    const token = jwt.sign(
      { hash: req.body.hash },
      config.get("jwtPrivateKey"),
      { expiresIn: "1h" }
    );

    const checkInRefers = await Refers.findOne({
      where: { wallet_address: req.body.wallet_address },
    });

    const checkInBonusRefers = await Bonus_refer.findOne({
      where: { wallet_address: req.body.wallet_address },
    });

    const checkInBxgToken = await Bxg_token.findOne({
      where: { wallet_address: req.body.wallet_address },
    });

    if (!checkInRefers)
      await Refers.create({ wallet_address: req.body.wallet_address });
    if (!checkInBonusRefers)
      await Bonus_refer.create({ wallet_address: req.body.wallet_address });

    if (!checkInBxgToken)
      await Bxg_token.create({
        wallet_address: req.body.wallet_address,
        bxg: parseFloat(0),
      });

    return res.send({ status: true, access: token });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

const hashvalidate = (req) => {
  const schema = Joi.object({
    hash: Joi.string().required().label("Hash Field"),
    wallet_address: Joi.string().required(),
  });

  return schema.validate(req);
};

module.exports = router;
