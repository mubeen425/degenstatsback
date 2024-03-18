import React, { useContext, useEffect, useState } from "react";
import * as web3 from '@solana/web3.js'; // Ensure web3 is imported
import { Link } from "react-router-dom";
import "swiper/css";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import coin from "./../../../images/coin.png";
import Loader from "../Loader/Loader";
import SwiperSlider from "../Swipers/SwiperSlider";
import axios from "axios";
import jwt from 'jsonwebtoken';
import axiosInstance from "../../../services/AxiosInstance";


const Home = () => {
  const [bxgavailable, setbxgavailable] = useState(null);
  const [bxgstacked, setbxgstacked] = useState(null);
  const [totalEarning, settotalEarning] = useState(null);
  const [referralBonus, setreferralBonus] = useState(null);
  const [stakingreferralBonus, setStakingReferralBonus] = useState(null);
  const [rewardBonus, setRewardBonus] = useState(null);
  const [loader, setLoader] = useState(true); // Initially true to show loader while data is fetched
  const [todayProfit, setTodayProfit] = useState(0);
  const [weeklyProfit, setWeeklyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [solPrice,setSolPrice] = useState()
  const { changeBackground } = useContext(ThemeContext);
  
  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });

    const fetchWalletDetails = async () => {
      try {
        const response = await window.solana.connect(); // Connect to Solana wallet
        const address = response.publicKey.toString();
        console.log("Wallet Address:", address);

        const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
        console.log("connection", connection);

        const balanceInLamports = await connection.getBalance(response.publicKey);
        const balance = balanceInLamports / web3.LAMPORTS_PER_SOL;
        console.log("Balance in SOL:", balance);

        // Update state with fetched balance
        setbxgavailable(balance);
            const getuserData = await axiosInstance.get(`/api/bxg/${address}`)
            const currentDate = new Date();
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString('en-GB', options);
            
           const {day1,day7}  = getuserData.data

           if (day1 === null && day7 === null) {
            const updateBalance = await axiosInstance.put(`/api/bxg/${getuserData.data.id}`, { day1: `${formattedDate}:${balance}` })
            console.log("updateBalance: ",updateBalance);
          } else {
           let apiDate =  day1.split(":")[0] 
          if(apiDate == formattedDate ){
            const updateBalance = await axiosInstance.put(`/api/bxg/${getuserData.data.id}`, { day1: `${formattedDate}:${balance}` })
            console.log(updateBalance.data);
          } else{

            const updateBalance = await axiosInstance.put(`/api/bxg/${getuserData.data.id}`, { day7: `${formattedDate}:${balance}` })
            console.log(updateBalance.data);

          }
            
          }
          const profits = await axiosInstance.put(`/api/profit/${address}`, {balance})
          console.log("Profits: ", profits)
          setTodayProfit(profits.data.todays_profit)
          setWeeklyProfit(profits.data.weekly_profit)
          setMonthlyProfit(profits.data.monthly_profit)
            // let today = balance;//parseFloat(getuserData.data.day1.split(':')[1])
            // console.log("USer data: ", getuserData)
            // console.log("TOday: ",today )
            // console.log("Today's profit: ",today - (getuserData.data.bxg - 0.1));
            // let profit = today - (getuserData.data.bxg - 0.1);
            // if((profit + getuserData.data.bxg) > (getuserData.data.bxg - 0.1)){
            //   setTodayProfit(profit)
            // }
            // else{
            //   setTodayProfit(0);
            // }
            
            // if(getuserData.data.day7 == null){
            //   setWeeklyProfit(0)
            // }else{
            //   let weekly = parseFloat(getuserData.data.day7.split(':')[1])
            //   setWeeklyProfit(weekly - (getuserData.data.bxg - 0.1)); 
            // }
            // console.log("getuserData.data.day1: ", getuserData.data.day1.split(":")[0])
            // console.log("formattedDate.slice(3,5): ", formattedDate.slice(3,5))

            // if(getuserData.data.day1.split(":")[0].slice(3, 5) != formattedDate.slice(3,5)){
            //   setWeeklyProfit(0)
            // }else{
            //   let monthly = parseFloat(getuserData.data.day7.split(':')[1])
            //   setMonthlyProfit(monthly - (getuserData.data.bxg - 0.1)); 
            // }

            const usdPrice = await axios.get(
              'https://api.coincap.io/v2/assets/solana'
            );
             console.log(usdPrice.data.data.priceUsd);
              setSolPrice(usdPrice.data.data.priceUsd)
      } catch (error) {
        console.error('Error fetching wallet details:', error);
    
      } finally {
        setLoader(false);
      }
    };


    const interval = setInterval(fetchWalletDetails, 7000); // Run fetchWalletDetails every 5 seconds

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);

  }, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="row">
          <div className="col-xl-12">
            <SwiperSlider
              bxgavailable={bxgavailable}
              bxgstacked={bxgstacked}
              totalEarning={totalEarning}
              todayProfit = {todayProfit}
              weeklyProfit={weeklyProfit}
              monthlyProfit={monthlyProfit}
              solPrice={solPrice}
              // Pass other props as needed
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
