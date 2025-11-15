const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    votes: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]  // NEW
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
