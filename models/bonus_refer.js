const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const Bonus_refer = connection.define(
  "bonus_refer",
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
    isRefered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "bonus_refer",
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
  Bonus_refer,
  validatef,
};
