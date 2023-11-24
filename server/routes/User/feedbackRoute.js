const express = require("express");

const router = express.Router();

const feedbackController = require("../../controllers/user/feedbackController");

const userAuth = require("../../middleware/userAuth");

router.post(
  "/post-question-options",
  feedbackController.postFeedbackQnWithOptions
);

router.post(
  "/post-user-feedback",
  userAuth.authorization,
  feedbackController.postUserFeedback
);

module.exports = router;
