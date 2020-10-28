const Schema = require("mongoose");
import { Schema } from "mongoose";

const OrderSchema = new Schema({
  currency: {
    type: String,
    enum: ["BTC"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  buy: {
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    unitPrice: {
      type: Number,
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  },
  sell: {
    price: {
      type: Number,
    },
    unitPrice: {
      type: Number,
    },
    date: {
      type: Date,
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  },
  state: {
    type: String,
    enum: ["open", "closed"],
    required: true,
  },
});

OrderSchema.methods.closeOrder = async function ({ amount, price, unit }) {
  const Transaction = mongoose.model("Transaction");

  try {
    const transaction = await Transaction.sell({ amount, price });
    this.sell = {
      price: price,
      date: new Date(),
      transaction: transaction,
      unitprice: unit,
    };

    this.state = "closed";

    await this.save();
    
  } catch (err) {
    console.log(err);
  }
};
