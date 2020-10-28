import { get } from "../configuration";
// https://github.com/coinbase/coinbase-node
import coinbase from "coinbase";
import { Client } from "coinbase";

const pricing = require("../pricing");
const database = require("../database");
const util = require("util");
const setTimeoutPromise = util.promisify(setTimeout);

const mainLoop = async () => {
  const time = 10 * 1000;
  try {
    // getting buy price only
    // const buyPrice = await pricing.getBuyPrice();
    // console.log(`buy: ${buyPrice.amount}`);

    // getting sellPrice only
    // const sellPrice = await pricing.getSellPrice();
    // console.log(`sell: ${sellPrice.amount}`);

    // getting spot price only
    // const spot = await pricing.getSpotPrice();
    // console.log(`spot: ${spot.amount}`);

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
