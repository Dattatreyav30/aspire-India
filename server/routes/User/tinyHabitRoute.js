const express = require("express");

const router = express.Router();

const tinyHabitController = require("../../controllers/user/tinyHabitController");

//moddleware
const userAuth = require("../../middleware/userAuth");

router.post("/post-tiny-habits", tinyHabitController.postTinyHabits);

router.get("/get-tiny-habits", userAuth.authorization, tinyHabitController.getTinyHabits);

router.post(
  "/post-tiny-habit-completion",
  userAuth.authorization,
  tinyHabitController.tinyHabitCompletion
);

module.exports = router;
