const config = require("config");
const { Sequelize } = require("sequelize");
const { DATABASE, USERNAME, PASSWORD, HOST, PORT } = config.get("INDBCONFIG");

const poolConfig = {
  max: 10, 
  min: 0, 
  acquire: 30000, 
  idle: 10000,
};


module.exports = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    connectTimeout: 30000
  },
  pool:poolConfig,
  port: PORT,
});