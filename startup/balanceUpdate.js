const { Bxg_token } = require("../models/bxg_token");
const { getbxgbalance } = require("../contractABI/bxgbalance");

module.exports = async () => {
  try {
    const bxgTokens = await Bxg_token.findAll({ raw: true });
    if (bxgTokens.length > 0) {
      for (const bxgToken of bxgTokens) {
        const balance = await getbxgbalance(bxgToken.wallet_address);
        const bxgTokenModel = await Bxg_token.findOne({
          where: { wallet_address: bxgToken.wallet_address },
        });
        if (bxgTokenModel) {
          bxgTokenModel.bxg = balance;
          await bxgTokenModel.save();
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
