const cron = require("node-cron");
const Job = require("../Cron/goldPriceUpdateJob");
module.exports = cron.schedule("1 * * * *", Job);

