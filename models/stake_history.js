const { DataTypes,Sequelize } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const StakeHistory = connection.define(
  "stake_history",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stake_id: {
      type: DataTypes.INTEGER,
    },
    wallet_address: {
      type: DataTypes.STRING,
    },
    bxg: {
      type: DataTypes.FLOAT,
    },
    blockhash: {
      type: DataTypes.STRING,
    },
    stake_time: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    type: {
      type: DataTypes.STRING,
    },
    reward:{
      type:DataTypes.FLOAT,
    }
  },
  {
    tableName: "stake_history",
    timestamps: false,
  }
);

function validateS(req) {
  const schema = Joi.object({
    stake_id: Joi.required(),
    bxg: Joi.required(),
    blockhash: Joi.required(),
    wallet_address: Joi.required(),
  });

  return schema.validate(req);
}

module.exports = {
  StakeHistory,
  validateS,
};
