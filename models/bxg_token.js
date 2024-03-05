const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const Bxg_token = connection.define(
  "bxg_token",
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
    day1:{
      type: DataTypes.STRING,
    },
    day7:{
      type: DataTypes.STRING,
    }
  },
  {
    tableName: "bxg_token",
    timestamps: false,
  }
);

function validateS(req) {
  const schema = Joi.object({
    wallet_address: Joi.required(),
    bxg: Joi.required(),
    blockhash: Joi.required(),
    usdt: Joi.required(),
  });

  return schema.validate(req);
}

module.exports = {
  Bxg_token,
  validateS,
};
