const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const web3loginRouter = require("../routes/Web3Login");
const bxgRouter = require("../routes/bxg_token");
const bxgHistoryRouter = require("../routes/bxg_history");
const stakeHistoryRouter = require("../routes/stake_history");
const stakeRouter = require("../routes/stake");
const referRouter = require("../routes/refer");
const bonusReferRouter = require("../routes/bonus_refer");
const bonusReferRewardRouter = require("../routes/bonus_refer_reward");
const stakeReferRewardRouter = require("../routes/stake_refer_reward");
const profileRouter = require("../routes/profile");
const profitRouter = require("../routes/bxg_reward_history");
const IsUser = require("../middlewares/AuthMiddleware");
const twitter = require("../routes/social");
const passport = require("passport");
var config = require("../utils/twitterConfig");
var confige = require("../utils/InstagramConfig")
const { TwitterApi } = require("twitter-api-v2");
const Tweet = require("../models/tweet");
const Instagram =require("../models/instagram")
const {InstagramApi, Client} = require("instagram-graph-api")
const CronJob = require("cron").CronJob;

const client = new TwitterApi(config);
// const Client1 =new InstagramApi(instagramconfig)
const bearer = new TwitterApi(
  "AAAAAAAAAAAAAAAAAAAAAL77owEAAAAAN%2BrJXg9jYkLr%2FpwkS8C%2Bgvu3ihI%3DAZMlsTEgoMiITQloi9Q2pCViJeb6p9HryhvtYdhh21BHblMExV"
);

const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;
const instagramClient =Client.readOnly;
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

module.exports = function (app) {
  app.use(
    session({
      secret: "something",
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("tiny"));
  app.get("/", async (req, res) => {
    res.send("working");
  });
  app.use("/user/login", web3loginRouter);
  app.use("/api/bonusrefer", bonusReferRouter);
  app.use("/api/refer", referRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/profit",profitRouter);
  app.get("/twitter/post/:text", async (req, res) => {
    await Tweet.create({
      id: Math.floor(Math.random() * 10),
      text: req.params.text,
    });
    res.redirect("/auth/twitter");
  });


  app.get("/instagram/post/:text", async (req, res) => {
    await Instagram.create({
      id: Math.floor(Math.random() * 10),
      text: req.params.text,
    });
    res.redirect("/auth/instagram");
  });

  app.get("/auth/twitter", passport.authenticate("twitter"));

  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/profile",
      failureRedirect: "/auth/twitter",
    })
  );
  
  app.get('/auth/instagram', passport.authenticate('instagram'));

  app.get('/auth/instagram/callback',
    passport.authenticate('instagram', {
      successRedirect: '/profile',
      failureRedirect: '/auth/instagram',
    })
  );
  
  app.get("/profile", async (req, res) => {
    if (req.isAuthenticated()) {
      // try {
      //   // const data = await twitterClient.v2.singleTweet()
      //   const data = await twitterClient.v2.search('1684303310298451968')
      //   console.log(data);
      // } catch (e) {
      //   console.log(e);
      // }


      // const mediaUrl = 'URL_OF_YOUR_MEDIA';
      // const caption = 'Your caption goes here';
      
      // // Assuming you have authenticated and obtained the necessary access token
      // if (authenticated) {
      //   try {
      //     const response = await instagramClient.post('/me/media', {
      //       media_url: mediaUrl,
      //       caption: caption
      //     });
      
      //     const mediaId = response.data.id;
      
      //     // Perform additional actions if needed, like saving mediaId or updating database
      
      //     res.redirect('http://127.0.0.1:3000/complete-task?status=success');
      //   } catch (error) {
      //     console.error('Error posting media:', error);
      //     res.redirect('http://127.0.0.1:3000/complete-task?status=' + error.message);
      //   }
      // } else {
      //   res.status(401).send('Please login to post on Instagram.');
      // }
      
    //  const Instagram = await Instagram.findOne({
    //   order:[["id",'DESC']],
    //  });

    //  const instagramText = Instagram.text;
    //  try{
    //   const response =await instagramClient.Instagram(instagramText);
    //   console.log("successfully Posted On Insatgram", response);
    //   Instagram.InstagramID =response.data.id;
    //   Instagram.text =response.data.text;
    //   Instagram.save()
    //     .then((result)=>{
    //       res.redirect('http://127.0.0.1:3000/complete-task?status=success');
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    //        }
    //        catch (err) {
    //         console.error("Error posting on instagram :", err);
    //         res.redirect("http://127.0.0.1:3000/complete-task?status="+err.message)
    //       }



















  //   const foundInstagram = await Instagram.findOne({
  //     order: [["id", "DESC"]],
  //   });
    
  //   if (foundInstagram){
  //     const instagramText = foundInstagram.text;

    
  //   try {
  //     const response = await instagramClient.Instagram(instagramText);
  //     console.log("successfully Posted On Instagram", response);
  //     foundInstagram.InstagramID = response.data.id;
  //     foundInstagram.text = response.data.text;
  //     foundInstagram.save()
  //       .then((result) => {
  //         res.redirect("http://127.0.0.1:3000/complete-task?status=success");
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } catch (err) {
  //     console.error("Error posting on Instagram:", err);
  //     res.redirect("http://127.0.0.1:3000/complete-task?status=" + err.message);
  //   }
  // }else {
  //   console.error("No Instagram entry found in the database.");
  //   res.redirect("http://127.0.0.1:3000/complete-task?status=error");
  // }
    








      const tweet = await Tweet.findOne({
        order: [['id', 'DESC']], // Replace 'id' with the primary key or timestamp field name
      });
      const tweetText = tweet.text;
      try {
        const response = await twitterClient.v2.tweet(tweetText);
        console.log("Tweet posted successfully", response);
        tweet.tweetID = response.data.id;
        tweet.text = response.data.text;
        tweet.save()
          .then((result) => {
            res.redirect("http://127.0.0.1:3000/complete-task?status=success")
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (err) {
        console.error("Error posting tweet:", err);
        res.redirect("http://127.0.0.1:3000/complete-task?status="+err.message)
      }
    } else {
      res.status(401).send("Please login to post on Twitter.");
    }
  });




  

  // module.exports = app;

  app.use(IsUser);
  app.use("/api/bxg", bxgRouter);
  app.use("/api/bxghistory", bxgHistoryRouter);
  app.use("/api/stake", stakeRouter);
  app.use("/api/stakehistory", stakeHistoryRouter);

  app.use("/api/bonusrefreward", bonusReferRewardRouter);
  app.use("/api/stakerefreward", stakeReferRewardRouter);
};

// const cronTweet = new CronJob("30 * * * * *", async () => {
//     try {
//       const data = await twitterClient.v2.tweet("Hello world!");
//       console.log(data);
//     } catch (e) {
//       console.log(e)
//     }
// });
