const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const BonusReferReward = connection.define(
  "bonus_refer_reward",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wallet_address: {
      type: DataTypes.STRING,
    },
    refer_code: {
      type: DataTypes.STRING,
    },
    reward: {
      type: DataTypes.FLOAT,
    },
  },
  {
    tableName: "bonus_refer_reward",
    timestamps: true,
  }
);

function validatef(req) {
  const schema = Joi.object({
    wallet_address: Joi.required(),
    refer_code: Joi.required(),
    reward:Joi.required()
  });

  return schema.validate(req);
}

module.exports = {
  BonusReferReward,
  validatef,
};
