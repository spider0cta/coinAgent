import Price from "models/price";
import moment from "moment";
const technical = require("technicalindicators");
const Transaction = require("../transaction/model");
const Order = require("../orders/model");
const SMA = technical.SMA;
const BB = technical.BollingerBands;

exports.onPrice = async function (price) {
  const start = moment().subtract(6, "hours").toDate();

  const means = await Price.getMinutelyMean({ start, interval: 10 });

  const period = 20;

  const bands = BB.calculate({
    period,
    value: means,
    stdDev: 2,
  });

  if (bands.length == 0) {
    return;
  }

  const recent = bands[bands.lenght - 1];
  const currentPrice = price.spot;

  const upper = recent.upper;
  const mid = recent.middle;
  const lower = recent.lower;

  const lowerBand = (mid - lower) * 0.3 + lower;
  const upperband = (upper - mid) * 0.7 + mid;

  const order = await Order.findOne({ state: "open" });

  if (order) {
    const quote = await Transaction.sellQuote({ total: order.amount });
    if (currentPrice > upperband && order.buy.price < quote.amount.cost) {
      const order = await Order.closeOrder({
        amount: quote.amount.amount,
        price: quote.cost.amount,
        unit: currentPrice,
      });

      console.log(`Sold at ${order.sell.price}`);
      console.log(`Profit from order : ${order.sell.price - order.buy.price}`);
    } else {
      const quote = await Transaction.buyQuote({ total: 500 });

      if (currentPrice < lowerBand) {
        const order = await Order.openOrder({
          amount: quote.amount.amount,
          price: quote.cost.amount,
          unit: currentPrice,
        });

        if (order) {
          console.log(`Bought at : ${order.buy.price}`);
        }
      }
    }
  }

  console.log(`Current : ${currentPrice}`);
};

// exports.getBollinger = async function ({
//   start,
//   period = 1,
//   end = Date(),
// } = {}) {
//   const prices = await Price.getRange({ start, end });

//   const total = prices.length - period;

//   const input = {
//     period: total,
//     values: prices,
//     stdDev: 2,
//   };

//   const outcome = BB.calculate(input);
//   return outcome;
// };

// exports.showAvailable = function ({ bollinger, prices } = {}) {
//   const bol = bollinger[0];
//   const midrange = bol["middle"];
//   const low = bol["lower"];
//   const midLow = (midrange - low) / 2 + low;
//   console.log(midrange);
//   console.log(low);
//   console.log(midLow);

//   const availables = prices.filter((price) => {
//     return price < midrange;
//   });

//   console.log(`${availables.length}/${prices.length}`);
// };
