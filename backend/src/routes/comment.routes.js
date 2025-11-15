const express = require("express");
const { addComment, getComments } = require("../controllers/comment.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

const admin = require("../middleware/admin.middleware");

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id", protect, addComment);
router.get("/:id", getComments);

module.exports = router;
