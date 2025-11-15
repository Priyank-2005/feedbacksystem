const Comment = require("../models/comment.model");

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      text,
      user: req.user._id,
      feedbackId: req.params.id,
    });

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ feedbackId: req.params.id }).populate("user", "name");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
