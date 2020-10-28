import mongooose from "mongoose";
import Schema from "mongoose";
import client from "client";
import config from "../configuration";

const WalletSchema = new Schema({
  coinbaseId: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },

  balance: {
    currency: {
      type: String,
      enum: ["BTC", "GBP"],
    },
    amount: {
      type: Number,
      required: true,
    },
  },
});

WalletSchema.statics.addToCurrency = async function ({ type, amount }) {
  const Wallet = this;
  const wallet = await Wallet.findOneAndUpdate(
    { "balance.currency ": type },
    { $inc: { "balance.amount": amount } },
    { new: true, runValidators: true }
  );

  return wallet;
};
