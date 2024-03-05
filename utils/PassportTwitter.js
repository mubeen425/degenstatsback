const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
// Replace with your Twitter API credentials
const TWITTER_CONSUMER_KEY = "ic2WW3bJfonL5YyznE7zHlpbZ";
const TWITTER_CONSUMER_SECRET = "RQhas2lFmpHepzfOiNod4MGz3Y79FbfrnCLo9wuV9ObwfqIyBp";
passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: 'http://127.0.0.1:4000/auth/twitter/callback',
    },
    function (token, tokenSecret, profile, done) {
      // At this point, you can save the user's profile information in your database or create a new user account if it doesn't exist.
      console.log(token);
      return done(null, token);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

module.exports = passport;
