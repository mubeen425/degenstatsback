


const express = require("express");
const app = express();
const passport = require('../utils/PassportInstagram'); // Import the passport configuration
const instagram = require("../routes/social"); // Import the Instagram router

app.use(passport.initialize());

// Mount the Instagram router
app.use("/", instagram);

module.exports = app; // Export the Express app
