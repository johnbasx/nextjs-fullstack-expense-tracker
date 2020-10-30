const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    transaction_type: {
      type: String,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    invoice_photo: {
      data: Buffer,
      contentType: String,
    },
    date: {
      type: Date,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
