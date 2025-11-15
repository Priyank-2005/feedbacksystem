const express = require("express");
const { createFeedback, getAllFeedback, upvoteFeedback, getFeedbackById } =
  require("../controllers/feedback.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

const admin = require("../middleware/admin.middleware");

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", protect, createFeedback);
router.get("/", getAllFeedback);
router.get("/:id", getFeedbackById);         // <-- new single-get route
router.put("/:id/upvote", protect, upvoteFeedback);

module.exports = router;
