const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const Bxg_reward_history = connection.define(
  "bxg_reward_history",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wallet_address: {
      type: DataTypes.STRING,
    },
    today_date:{
        type :DataTypes.DATE ,
    },
    day_start_balance: {
      type: DataTypes.FLOAT,
    },
    day1_profit:{
      type: DataTypes.FLOAT,
    },
    weekly_profit:{
      type: DataTypes.FLOAT,
    },
    monthly_profit:{
        type: DataTypes.FLOAT,
    }
  },
  {
    tableName: "bxg_reward_history",
    timestamps: true,
  }
);

function validateS(req) {
  const schema = Joi.object({
    wallet_address: Joi.required(),
  });

  return schema.validate(req);
}

module.exports = {
  Bxg_reward_history,
  validateS,
};
