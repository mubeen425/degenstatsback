const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const Profile = connection.define(
  "profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wallet_address: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    whatsapp:{
      type:DataTypes.STRING
    },
    fee:{
      type:DataTypes.STRING
    },
    firstbalance:{
      type:DataTypes.DECIMAL
    },
    converted:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    }
  },
  {
    tableName: "profile",
    timestamps: false,
  }
);

function validateP(req) {
  const schema = Joi.object({
    wallet_address: Joi.required(),
    email: Joi.string().required(),
    whatsapp: Joi.required(),
  });

  return schema.validate(req);
}

module.exports = {
  Profile,
  validateP,
};
