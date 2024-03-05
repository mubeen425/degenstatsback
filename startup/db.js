const connection = require("../utils/connection");
const indconnection=require("../utils/indconnection")
module.exports = function () {
  try {
    connection.authenticate().then(() => console.log("connected to database"));
    indconnection.authenticate().then(() => console.log("connected to indonesion version database"));
    connection
      .sync({ alter: true })
      .then(() => console.log("synced successfully"));
  } catch (error) {
    console.error("enable to connect to database");
  }
};
