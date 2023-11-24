const express = require("express");

const router = express.Router();

const feedbackController = require("../../controllers/user/feedbackController");

router.post('/post-question-options',feedbackController.postFeedbackQnWithOptions);

module.exports = router