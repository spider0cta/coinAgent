import { get } from "../configuration";
// https://github.com/coinbase/coinbase-node
import coinbase from "coinbase";
import { Client } from "coinbase";

const pricing = require("../pricing");
const database = require("../database");
const util = require("util");
const setTimeoutPromise = util.promisify(setTimeout);
const Price = require("../models/price");
const Trading = require("../trading");

const mainLoop = async () => {
  const time = 10 * 1000;
  try {
    const prices = await pricing.getPrices();
    const price = await Price.create(prices);
    console.log(prices);
    await Trading.onPrice(price);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  start: async () => {
    await database.connect();
    setInterval(mainLoop, time);
    mainLoop();
  },
};
