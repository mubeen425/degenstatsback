
// const passport1 =require('passport');
// const InstagramStrategy = require('passport-instagram').Strategy;
// const INSTAGRAM_CLIENT_ID = "2192971150897323";
// const INSTAGRAM_CLIENT_SECRET = "94f416fb5fda5d511ed033e78fa980a8";
// passport1.use(
//     new InstagramStrategy({
//    clientID:INSTAGRAM_CLIENT_ID,
//    clientSecret: INSTAGRAM_CLIENT_SECRET,
//     callbackURL: "http://127.0.0.1:3000/auth/instagram/callback"
//   },
//   function( refreshToken, token,tokenSecret, profile, done) {
//     User.findOrCreate({ instagramId: profile.id }, function (err, user) {
//         console.log(token);
//       return done(err, user,token,profile);
//     });
//   }
// ));

// passport1.serializeUser((user, done) => {
//     done(null, user);
//   });
  
//   // Deserialize user
//   passport1.deserializeUser((user, done) => {
//     done(null, user);
//   });
//   module.exports= passport1;


const passport1 = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;
const INSTAGRAM_CLIENT_ID = "770875058121618";
const INSTAGRAM_CLIENT_SECRET = "af85f941fb03a1862008013d0c563172";

passport1.use(
  new InstagramStrategy({
    clientID: INSTAGRAM_CLIENT_ID,
    clientSecret: INSTAGRAM_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/instagram/callback"
  },
  function(accessToken, token, refreshToken, profile, done) {
    User.findOrCreate({ instagramId: profile.id }, function (err, user) {
      if (err) {
        return done(err);
      }
      console.log(accessToken,token); // This will log the access token
      return done(null, user,token,profile);
    });
  }
));

passport1.serializeUser((user, done) => {
  done(null, user);
});

passport1.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport1;
