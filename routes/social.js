// const express = require("express");
// const router = express.Router();
// const passport = require('passport');

// router.get('/login', (req, res) => {
//     res.send('<a href="/auth/twitter">Login with Twitter</a>');
//   });

// router.get('/auth/twitter',passport.authenticate('twitter'));

// // router.get('/auth/twitter/callback', 
// //   passport.authenticate('twitter', { failureRedirect: '/login' }),
// //   function(req, res) {
// //     // Successful authentication, redirect home.
// //     res.redirect('/profile');
// //   });

// router.get('/auth/twitter/callback', 
//   function(req, res) {
//     // Successful authentication, redirect home.
//     // res.redirect('/profile');
//     console.log(req);
//   });


//   router.get('/auth/instagram/callback',
//   passport.authenticate('instagram')),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     // res.redirect('/profile');
//     console.log(req);
//   };

// // router.get('/auth/instagram/callback', 

// //   passport.authenticate('instagram', { failureRedirect: '/login' }),
// //   function(req, res) {
// //     // Successful authentication, redirect home.
// //     res.redirect('/');
// //   });

  
//   router.get('/profile', (req, res) => {
//     // Access the authenticated user's information using req.user
//     res.send('Welcome to your profile, ' + req.user.displayName);
//   });
  

// module.exports = router;




const express = require("express");
const router = express.Router();
const passport = require('passport');

router.get('/login', (req, res) => {
  res.send('<a href="/auth/twitter">Login with Twitter</a>');
});

// router.get('/login', (req, res) => {
//   res.send('<a href="/auth/instagram">Login with instagram</a>');
// });


router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', 
  function(req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/profile');
    console.log(req);
  });

  router.get('/auth/instagram', passport.authenticate('instagram'));
router.get('/auth/instagram/callback',
  passport.authenticate('instagram'), // Passport middleware should be here
  function(req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/profile');
    console.log(req);
  });

router.get('/profile', (req, res) => {
  // Access the authenticated user's information using req.user
  res.send('Welcome to your profile, ' + req.user.displayName);
});

module.exports = router;
