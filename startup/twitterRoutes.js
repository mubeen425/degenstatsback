const twitter = require("../routes/social");
const express = require("express");
const app = express();
const passport = require('../utils/PassportTwitter'); // Import the passport configuration

app.use(passport.initialize());

module.exports = function () {
    app.use("/", twitter);
}