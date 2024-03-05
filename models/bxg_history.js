const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const Bxg_history = connection.define(
  "bxg_history",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wallet_address: {
      type: DataTypes.STRING,
    },
    blockhash: {
      type: DataTypes.STRING,
    },
    bxg: {
      type: DataTypes.FLOAT,
    },
    usdt: {
      type: DataTypes.FLOAT,
    },
    type: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "bxg_history",
    timestamps: true,
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
  Bxg_history,
  validateS,
};
