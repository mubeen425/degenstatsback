const express = require("express");
const moment = require("moment");
const { Bxg_token } = require("../models/bxg_token");
const { Bxg_history } = require("../models/bxg_history");
const { Profile, validateP } = require("../models/profile");
const { StakeBxg } = require("../models/stake");
const indconnection=require("../utils/indconnection");
const { StakeHistory } = require("../models/stake_history");
const { Sequelize } = require("sequelize");

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const getHistory = await Profile.findAll();

    let allProfilesWithBxg =[];
    let totalBxgAvailable=0;
    for (const prof of getHistory) {
      const findBxg = await Bxg_token.findOne({
        where: { wallet_address: prof.wallet_address },
      });
      totalBxgAvailable+=findBxg?findBxg.bxg:0
      allProfilesWithBxg.push({
        wallet_address: prof.wallet_address,
        email: prof.email,
        whatsapp: prof.whatsapp,
        fee: prof.fee,
        bxg: findBxg?findBxg.bxg:0,
        balance:prof.balance
      });
    }
    const totalClaimReward = await StakeBxg.sum("total_claim_reward");
    const totalBxgStaked = await StakeBxg.sum("bxg");
    const totalBxgBought = await Bxg_history.sum("bxg",{
      where:{type:'Bought'}
    });
    const userCount=allProfilesWithBxg.length;
    return res.send({allProfilesData:allProfilesWithBxg,
      userCount:userCount,totalBxgAvailable:totalBxgAvailable,
      totalClaimReward:totalClaimReward?totalClaimReward:0,
      totalBxgStaked:totalBxgStaked,
      totalBxgBought:totalBxgBought
    });
  } catch (error) { 
    return res.send({ message: error.message });
  }
});


router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getRequestsByUserId = await Profile.findOne({
      where: { wallet_address: req.params.wallet_address },
    });
   if(!getRequestsByUserId) return res.send({})
    return res.send(getRequestsByUserId);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post('/',async(req, res)=>{
   try {
     const { error } = validateP(req.body);
     if (error) throw new Error(error.details[0].message);
 
     const prof=await Profile.create(req.body);
 
     return res.send(prof)
   } catch (error) {
    return res.send({status:false,message:error.message})
   }
})
router.post('/convert', async (req, res) => {
  try {
    if (!req.body.wallet_address || !req.body.new_wallet) throw new Error("Old or new Wallet is missing.");
    const profile=await Profile.findOne({where:{wallet_address:req.body.wallet_address}})
    if(!profile) throw new Error("Profile not found.")

    const getUserfromIndversiondb = await indconnection.query(
      `SELECT * FROM user WHERE wallet_public_key = '${req.body.new_wallet}'`
    );
    if (getUserfromIndversiondb.length === 0) {
      throw new Error("User not found");
    }

    const user_id = getUserfromIndversiondb[0][0].id;

    const stakeHistory = await StakeHistory.findAll({ where: { wallet_address: req.body.wallet_address } });
    const bxgHistory = await Bxg_history.findAll({ where: { wallet_address: req.body.wallet_address } });
    const currentstkbxg=await StakeBxg.findOne({where:{wallet_address:req.body.wallet_address}})
    
    // const gettingstkbxgandrewardInd=await indconnection.query(`SELECT * FROM stake_bxg WHERE user_id=${user_id}`)

    const stakeHistoryToIndversion = stakeHistory.map(sh => ({
      user_id,
      stake_id:sh.stake_id,
      bxg:sh.bxg,
      blockhash:sh.blockhash,
      type:sh.type,
      reward:sh.reward,
      stake_time:sh.stake_time
    }));

    const bxgHistoryToIndversion = bxgHistory.map(bxgh => ({
      user_id,
      blockhash: bxgh.blockhash,
      bxg: bxgh.bxg,
      usdt: bxgh.usdt,
      type: bxgh.type,
      createdAt:bxgh.createdAt.toISOString(),
      updatedAt:bxgh.updatedAt.toISOString()
    }));

    for (const bxgHis of bxgHistoryToIndversion) {
    let type=bxgHis.type=='pending'?'sell_pending':bxgHis.type;
      const insertBxgQuery = `INSERT INTO bxg_history (user_id, blockhash, bxg, usdt, type,createdAt,updatedAt)
      VALUES (${bxgHis.user_id}, '${bxgHis.blockhash}', ${bxgHis.bxg}, ${bxgHis.usdt}, '${type}','${bxgHis.createdAt}','${bxgHis.updatedAt}')`;
  
     await indconnection.query(insertBxgQuery, (err, result) => {
        if (err) {
          console.error(err);
          throw new Error(err);
        } else {
          console.log(result);
        }
      });
    }


for (const stkhis of stakeHistoryToIndversion) {
  if(stkhis.type!="Staked"){
    let type=stkhis.type=='Stake'?'stake':stkhis.type;
    const formattedStakeTime = moment(stkhis.stake_time).format('YYYY-MM-DD HH:mm:ss');
  const insertStakeQuery = `INSERT INTO stake_history (user_id, stake_id, bxg, blockhash, type, reward, stake_time)
       VALUES (${stkhis.user_id}, ${stkhis.stake_id}, ${stkhis.bxg}, '${stkhis.blockhash}', '${type}', ${stkhis.reward}, '${formattedStakeTime}')`;
  
  await indconnection.query(insertStakeQuery, (err, result) => {
    if (err) {
      console.error(err);
      throw new Error(err);
    } else {
      console.log(result);
    }
  });
}
}

await indconnection.query( `UPDATE stake_bxg SET bxg = bxg + ${currentstkbxg.bxg}, total_claim_reward = total_claim_reward + ${currentstkbxg.total_claim_reward} WHERE user_id = ${user_id}`, (err, result) => {
  if (err) {
    console.error(err);
    throw new Error(err);
  } else {
    console.log(result);
  }
})


profile.converted=true;
await profile.save();
    res.send({status:true,message:'Stake and BXG history conversion completed successfully'});
  } catch (error) {
    res.status(500).send(error.message);
  }
});



router.put("/:id",async(req,res)=>{
   try {
     const checkUser = await Profile.findOne({ where: { id: req.params.id } });
     if (!checkUser)
       throw new Error("User Not Found With The Given Id.");
 
   await Profile.update(
       { ...req.body },
       { returning: true, where: { id: req.params.id } }
     );
     return res.send("updated");
   } catch (error) {
    return res.send({status:false,message:error.message})
   }
})

module.exports = router;
