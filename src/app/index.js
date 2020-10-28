import { get } from "../configuration";
// https://github.com/coinbase/coinbase-node
import coinbase from "coinbase";
import { Client } from "coinbase";

const util = require("util");
const setTimeoutPromise = util.promisify(setTimeout);

const mainLoop = async () => {
  const time = 10 * 1000;
  try {
    const buyPrice = await pricing.getBuyPrice();
    console.log(`buy: ${buyPrice.amount}`);

    const sellPrice = await pricing.getSellPrice();
    console.log(`sell: ${sellPrice.amount}`);

    const spot = await pricing.getSpotPrice();
    console.log(`spot: ${spot.amount}`);

    const prices = await pricing.getPrices();
    console.log(prices);
  } catch (error) {
    console.log(error);
  }
  await setTimeoutPromise(time);
  mainLoop();
};

module.exports = {
  start: async () => {
    await database.connect();
    mainLoop();
  },
};
