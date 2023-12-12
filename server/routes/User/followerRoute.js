const express = require("express");

const router = express.Router();

const followerController = require("../../controllers/user/followerController");

const userAuth = require("../../middleware/userAuth");

router.post(
  "/send-request",
  userAuth.authorization,
  followerController.sendFollowerReq
);

router.post(
  "/respond-request",
  userAuth.authorization,
  followerController.respondFollowerRequest
);

router.get(
  "/get-followers",
  userAuth.authorization,
  followerController.getUserFollowers
);

router.get(
  "/get-following",
  userAuth.authorization,
  followerController.getUserFollowing
);

module.exports = router;
