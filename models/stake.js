const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const StakeBxg = connection.define(
  "stake_bxg",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wallet_address: {
      type: DataTypes.STRING,
    },
    bxg: {
      type: DataTypes.FLOAT,
    },
    total_claim_reward: {
      type: DataTypes.FLOAT,
    },
  },
  {
    tableName: "stake_bxg",
    timestamps: false,
  }
);

function validateS(req) {
  const schema = Joi.object({
    stake_id:Joi.required(),
    bxg: Joi.required(),
    blockhash: Joi.required(),
    wallet_address: Joi.required(),
  });

  return schema.validate(req);
}

module.exports = {
  StakeBxg,
  validateS,
};
