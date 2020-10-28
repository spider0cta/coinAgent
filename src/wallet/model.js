import mongooose, { model } from "mongoose";
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

WalletSchema.methods.updateCurrency = function () {
  return new Promise((res, rej) => {
    client.getAccount(this.coinbaseId, async (err, account) => {
      if (error) {
        rej(error);
      }

      const balance = account.balance;

      const data = {
        currency: balance.currency,
        amount: balance.amount,
      };

      this.balance = data;

      await this.save();
      resolve(this);
    });
  });
};

WalletSchema.statics.createFromCoinbaseAccount = async function (account) {
  const Wallet = this;
  const coinbaseId = account.id;

  const exists = await Wallet.findOne({ coinbaseId });

  if (exists) {
    await exists.updateCurrency();
    return exists;
  } else {
    const wallet = await Wallet.create({ coinbaseId, "balance.amount": 0 });
    if (wallet) {
      await wallet.updateCurrency();
    }
    return wallet;
  }
};

const walletForName = async function (name, wallets) {
  const wallet = wallets[name];
  if (!wallet) {
    client.createAccount({ name }, async function (err, account) {
      const newWallet = await Wallet.createFromCoinbaseAccount(account);
      return newWallet;
    });
  } else {
    const newWallet = await Wallet.createFromCoinbaseAccount(wallet);
    return newWallet;
  }
};

WalletSchema.statics.initialize = function () {
  const wallet = this;
  return new Promise((res, rej) => {
    client.getAccounts({}, async function (err, accounts) {
      if (err) {
        return rej(err);
      }

      const name = config.get("BOT_WALLET_NAME_BTC");

      const wallets = accounts.reduce((obj, wallet) => {
        return Object.assign(obj, { [wallet.name]: wallet });
      }, {});

      const bitcoinWallet = await walletForName(name, wallets);

      const gbpName = "GBP Wallet";
      const gbpWallet = await walletForName(gbpName, wallets);

      resolve();
    });
  });
};

const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = Wallet;
