const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const Refers = connection.define(
  "refers",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wallet_address: {
      type: DataTypes.STRING,
    },
    refer1: {
      type: DataTypes.STRING,
    },
    refer2: {
      type: DataTypes.STRING,
    },
    refer3: {
      type: DataTypes.STRING,
    },
    isRefered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "refers",
    timestamps: false,
  }
);

function validatef(req) {
  const schema = Joi.object({
    wallet_address: Joi.required(),
    refer_code: Joi.required(),
  });

  return schema.validate(req);
}

module.exports = {
  Refers,
  validatef,
};
