const express = require("express");

const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const userAuth = require("../../middleware/userAuth");

const chatController = require("../../controllers/user/chatController");

router.post("/post-pre-message", chatController.postPrecuratedMessages);

module.exports = router;
