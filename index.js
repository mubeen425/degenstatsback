const express = require("express");
const app = express();
const session = require('express-session');
const passport = require('./utils/PassportTwitter'); // Import the passport configuration
const passport1=require('./utils/PassportInstagram');
const CronJob = require("cron").CronJob;
// const callbackURL= "http://127.0.0.1:3000/auth/instagram/callback"

app.use(
  session({
    secret: 'something',
    resave: true,
    saveUninitialized: true,
  })
  );
  
app.use(passport.initialize());
app.use(passport.session());
app.use(passport1.initialize());
app.use(passport1.session());

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/cronshedule");
require("./startup/twitterRoutes");
require("./startup/instagramRoutes")


// app.get('/auth/instagram', (req, res) => {
//   res.redirect(callbackURL);
// });








const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("listening on port" + port);
});



const cronTweet = new CronJob("30 * * * * *", async () => {
 
});