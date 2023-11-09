const express = require("express");

const router = express.Router();

const tinyHabitController = require("../../controllers/user/tinyHabitController");

router.post("/post-tiny-habits", tinyHabitController.postTinyHabits);

module.exports = router;
