import config from "../configuration";
import coinbase from "coinbase";
import { Client } from "coinbase";

const apiKey = get("COINBASE_API_KEY");
const apiSecret = get("COINBASE_API_SECRET");

const client = new Client({
  apiKey,
  apiSecret,
});

var currency = "BTC-USD";
module.exports = {
  setCurrency: (curr) => {
    currency = curr;
  },
  getPrices: async function () {
    const currencyPair = currency;

    const actions = [
      this.getSpotPrice(),
      this.getBuyPrice(),
      this.getSellPrice(),
    ];

    const results = await Promise.all(actions);
    const ordering = ["spot", "buy", "sell"];

    const dict = {};

    for (let i in ordering) {
      const order = ordering[i];
      const result = results[i];
      dict[order] = result;
    }
    return dict;
  },
  getSpotPrice: async () =>
    new Promise((resolve, reject) => {
      const currencyPair = currency;

      client.getSpotPrice({ currencyPair }, (err, obj) => {
        err ? reject(err) : resolve(obj.data);
      });
    }),
  getBuyPrice: async () =>
    new Promise((resolve, reject) => {
      const currencyPair = currency;

      client.getBuyPrice({ currencyPair }, (err, obj) => {
        err ? reject(err) : resolve(obj.data);
      });
    }),
  getSellPrice: async () =>
    new Promise((resolve, reject) => {
      const currencyPair = currency;
      client.getSellPrice({ currencyPair }, (err, obj) => {
        err ? reject(err) : resolve(obj.data);
      });
    }),
};
