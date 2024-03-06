const express = require("express");
const config = require("config");
const { Bxg_reward_history } = require("../models/bxg_reward_history");

const { Op } = require("sequelize");
const router = express.Router();


router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await Bxg_reward_history.findOne({
      where: { wallet_address: req.params.wallet_address },
    });
    if (!getAllRequestsByUserId) return res.send({});

    return res.send(getAllRequestsByUserId);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/:wallet_address", async (req, res) => {
    try {
      const checkUser = await Bxg_reward_history.findOne({ where: { wallet_address: req.params.wallet_address } });
      if (checkUser)
        throw new Error("User already exists against this Wallet Address.");
    if (!req.body.balance)
        throw new Error("wallet balance is missing.");
    const brr = await Bxg_reward_history.create({
        wallet_address: req.params.wallet_address,
        today_date: new Date(),
        day_start_balance: req.body.balance,
        day1_profit:0,
        weekly_profit:0,
        monthly_profit:0
    });
      return res.send("updated");
    } catch (error) {
     return res.send({status:false,message:error.message})
    }
  });


router.put("/:wallet_address", async (req, res) => {
  try {
    const checkUser = await Bxg_reward_history.findOne({ where: { wallet_address: req.params.wallet_address } });
    if (!checkUser)
      throw new Error("User Not Found With The Wallet Address.");
    if (!req.body.balance)
      throw new Error("wallet balance is missing.");
    let date = new Date();
    console.log("Date: ", date.getDate())
    console.log("checkUser.today_date: ", checkUser.today_date.getDate())

    let weekly_profit = checkUser.weekly_profit;
    let monthly_profit = checkUser.monthly_profit;
    let todays_profit = 0;
    console.log("monthly_profit: ", checkUser.monthly_profit)

    if(date.getMonth() != checkUser.today_date.getMonth()){
      monthly_profit = 0;
      await checkUser.update({
          monthly_profit: 0,
      });
    }
    
    if(date.getDate() != checkUser.today_date.getDate()){
      if((date.getDate() - checkUser.createdAt.getDate()) % 7 == 0){
        weekly_profit = 0;
        await checkUser.update({
            weekly_profit: 0,
        });
      }
      let day_end_profit = checkUser.day1_profit;
      if(checkUser.weekly_profit != 0)
        weekly_profit = Number(day_end_profit) + Number(checkUser.weekly_profit);
      else
        weekly_profit = day_end_profit;

      if(checkUser.monthly_profit != 0)
        monthly_profit = Number(day_end_profit) + Number(checkUser.monthly_profit);
      else
        monthly_profit = day_end_profit;

        console.log("day_end_profit: ", day_end_profit)
        console.log("weekly_profit: ", weekly_profit)
        console.log("monthly_profit: ", monthly_profit)

      await checkUser.update({
          today_date: new Date(),
          day_start_balance: req.body.balance,
          day1_profit: 0,
          weekly_profit,
          monthly_profit 
      });
    }
    else{
      todays_profit =  Number(req.body.balance) - Number(checkUser.day_start_balance);
      console.log("todays_profit: ", todays_profit)
      
      if(todays_profit > 0 && todays_profit != Number(checkUser.day1_profit)){
        await checkUser.update({
          day1_profit: todays_profit,
        });
      }
      else return res.status(200).json({
        todays_profit: checkUser.day1_profit,
        weekly_profit: checkUser.weekly_profit,
        monthly_profit: checkUser.monthly_profit,
       })
    }
   
    return  res.status(200).json({
      todays_profit,
      weekly_profit: Number(checkUser.weekly_profit) + Number(todays_profit),
      monthly_profit: Number(checkUser.monthly_profit) + Number(todays_profit),
     })
    // return res.send("updated");
  } catch (error) {
   return res.send({status:false,message:error.message})
  }
});


module.exports = router;
