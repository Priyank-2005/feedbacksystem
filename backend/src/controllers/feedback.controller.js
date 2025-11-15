const Feedback = require("../models/feedback.model");

// existing functions (createFeedback, getAllFeedback, upvoteFeedback)
// We'll include them and add getFeedbackById

exports.createFeedback = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const fb = await Feedback.create({
      title,
      description,
      category,
      user: req.user._id,
    });
    res.json(fb);
  } catch (err) {
    console.error("createFeedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("getAllFeedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });
    res.json(fb);
  } catch (err) {
    console.error("getFeedbackById error:", err);
    // if invalid ObjectId it throws a CastError -> return 400
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid id format" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.upvoteFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });

    const userId = req.user._id.toString();

    if (fb.voters.includes(userId)) {
      return res.status(400).json({ message: "You already upvoted this feedback" });
    }

    fb.votes += 1;
    fb.voters.push(userId);
    await fb.save();

    res.json(fb);
  } catch (err) {
    console.error("upvoteFeedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
