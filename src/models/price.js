import mongoose from "mongoose";
import { Schema } from "mongoose";

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

PriceSchema.statics.getMean = async function ({ start, end = Date() } = {}) {
  const prices = await Price.find({ time: { $gte: start, $lte: end } });
  const count = prices.length;
  const average = prices.reduce((sum, price) => sum + price.spot, 0) / count;
  return average;
};

PriceSchema.statics.getMax = async function ({ start, end = Date() } = {}) {
  const prices = await Price.find({ time: { $gte: start, $lte: end } });
  const max = prices.reduce((max, { spot }) => Math.max(max, spot), 0);
  return max;
};
