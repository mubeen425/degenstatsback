const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const ReferReward = connection.define(
  "refer_reward",
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
    level:{
        type:DataTypes.INTEGER
    },
    reward: {
      type: DataTypes.FLOAT,
    },
    type:{
      type:DataTypes.STRING,
      defaultValue:'pending',
    }
  },
  {
    tableName: "refer_reward",
    timestamps: true,
  }
);

function validatef(req) {
  const schema = Joi.object({
    wallet_address: Joi.required(),
    refer_code: Joi.required(),
    level:Joi.required(),
    reward:Joi.required()
  });

  return schema.validate(req);
}

module.exports = {
  ReferReward,
  validatef,
};
