const ethers = require("ethers");
const BitX = require("../contractABI/BitX.json");
const provider= new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org/");

const getbxgbalance=async(public_address)=>{
    let signer =
     new ethers.Wallet("0x8793700dfad313f01513eee0638343796c588e4bb1b58e7d3b9194f7b3d54d6b", provider);
    const bitxs = new ethers.Contract(BitX.address, BitX.abi, signer);
    const balance = await bitxs.balanceOf(public_address);
    const value = ethers.utils.formatEther(balance._hex);
    return value;
}

module.exports={getbxgbalance};