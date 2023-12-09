const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const express = require("express");

const router = express.Router();

const userController = require("../../controllers/user/userController");

const userAuth = require("../../middleware/userAuth");

router.post("/signup", upload.none(), userController.userSignup);

router.post("/login", upload.none(), userController.login);

router.get("/get-tower", userAuth.authorization, userController.getUserTower);

router.post("/send-otp", userAuth.authorization, userController.sendOtp);

module.exports = router;
