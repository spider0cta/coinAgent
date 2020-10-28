const config = require("../configuration");
import mongoose from "mongoose";
import { Schema } from "mongoose";
const moment = require("moment");

const PriceSchema = new Schema({
  base: {
    type: String,
    enum: ["BTC"],
    required: true,
  },
  currency: {
    type: String,
    enum: ["USD", "GBP", "EUR"],
    required: true,
  },
  buy: {
    type: Number,
    required: true,
  },
  sell: {
    type: Number,
    required: true,
  },
  spot: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
    index: true,
    required: true,
  },
});

const priceBetween = async ({ start, end } = {}) => {
  const currency = config.get("CURRENCY");
  return Price.find({
    currency,
    time: {
      $gte: start,
      $lte: end,
    },
  });
};

// getting range

PriceSchema.statics.getRange = async function ({ start, end = Date() } = {}) {
  const prices = await Price.find({ time: { $gte: start, $lte: end } });
  return prices.map((price) => price.spot);
};

PriceSchema.statics.getMean = async function ({ start, end = Date() } = {}) {
  const prices = await Price.find({ time: { $gte: start, $lte: end } });
  const count = prices.length;
  const average = prices.reduce((sum, price) => sum + price.spot, 0) / count;
  return average;
};

const getMeanInterval = async function ({ start, end, interval, mod }) {
  const startMoment = moment(start);
  const endMoment = moment(end);
  let current = startMoment;
  const intervals = [];

  while (current.isBefore(endMoment)) {
    const previous = current.toDate();
    current = current.add(interval, mod);

    intervals.push({
      start: previous,
      end: current.toDate(),
    });
  }

  const results = await Promise.all(
    intervals.map((start, end) => {
      return Price.getMean({ start, end });
    })
  );

  const means = results.filter((price) => {
    return !isNaN(price);
  });

  return means;
};

// getMinutelyMean method
PriceSchema.statics.getMinutelyMean = async function ({
  start,
  end = new Date(),
  interval = 5,
} = {}) {
  return getMeanInterval({
    start,
    end,
    interval,
    mod: "minute",
    Price: this,
  });
};

// getHouerlyMean method
PriceSchema.statics.getHourlyMean = async function ({
  start,
  end = new Date(),
  interval = 1,
} = {}) {
  return getMeanInterval({
    start,
    end,
    interval,
    mod: "Hour",
    Price: this,
  });
};

PriceSchema.statics.getMax = async function ({ start, end = Date() } = {}) {
  const prices = await Price.find({ time: { $gte: start, $lte: end } });
  const max = prices.reduce((max, { spot }) => Math.max(max, spot), 0);
  return max;
};

PriceSchema.statics.getMin = async function ({ start, end = Date() } = {}) {
  const prices = await Price.find({ time: { $gte: start, $lte: end } });
  const min = prices.reduce((min, { spot }) => Math.min(min, spot), Infinity);
  return min;
};

PriceSchema.statics.getMedian = async function ({ start, end = Date() } = {}) {
  const prices = await Price.find({ time: { $gte: start, $lte: end } });
  const spots = prices.map((price) => price.spot).sort((a, b) => a - b);
  const length = spots.length;
  const index = Math.floor(length / 2);

  if (length % 2) {
    return spots[index];
  }
  return (spots[index - 1] + spots[index]) / 2.0;
};

const Price = mongoose.model("Price", PriceSchema);

module.exports = Price;
