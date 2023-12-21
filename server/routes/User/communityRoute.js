const express = require("express");

const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userAuth = require("../../middleware/userAuth");

const communityController = require("../../controllers/user/communityController");

router.post(
  "/post-community",
  upload.fields([{ name: "image", maxCount: 1 }]),
  userAuth.authorization,
  communityController.postCommunityPosts
);
router.post(
  "/post-likes",
  userAuth.authorization,
  communityController.postLikes
);

router.get("/get-posts", communityController.getCommunityPosts);
router.post("/undo-like", userAuth.authorization, communityController.undoLike);

router.get("/get-user-likes",communityController.getUserLikes)

module.exports = router;
