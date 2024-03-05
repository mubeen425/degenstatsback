const ethers = require("ethers");
const BitXSwap = require("../contractABI/BitXGoldSwap.json");
const axios = require("axios");
const config = require("config");

const Job = async () => {
  try {
    const { data } = await axios.get("https://www.goldapi.io/api/XAU/USD", {
      headers: {
        "x-access-token": config.get("G_Access_Token"),
        "Content-Type": "application/json",
      },
    });

   
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = Job;
