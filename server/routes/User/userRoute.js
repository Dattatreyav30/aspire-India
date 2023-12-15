const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const express = require("express");

const router = express.Router();

const userController = require("../../controllers/user/userController");

const userAuth = require("../../middleware/userAuth");

router.post("/signup", upload.none(), userController.userSignup);

router.post("/login", upload.none(), userController.login);

router.post("/set-password", userController.setPassword);

router.post(
  "/set-profile",
  upload.fields([{ name: "profile_picture", maxCount: 1 }]),
  userAuth.authorization,
  userController.setProfile
);
router.get("/get-tower", userAuth.authorization, userController.getUserTower);

router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.otpVerification);

module.exports = router;
