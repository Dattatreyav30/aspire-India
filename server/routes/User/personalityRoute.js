const express = require("express");

const router = express.Router();

const PersonalityController = require("../../controllers/user/personalityController");

router.post("/post-question",PersonalityController.postPersonalityQuestion);


module.exports = router