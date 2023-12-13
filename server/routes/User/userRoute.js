const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const express = require("express");

const router = express.Router();

const userController = require("../../controllers/user/userController");

const userAuth = require("../../middleware/userAuth");

router.post("/signup", upload.none(), userController.userSignup);

router.post("/login", upload.none(), userController.login);

router.post(
  "/set-password",
  userController.setPassword
);

router.get("/get-tower", userAuth.authorization, userController.getUserTower);

router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.otpVerification);

module.exports = router;
