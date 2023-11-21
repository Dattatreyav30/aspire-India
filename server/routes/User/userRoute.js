const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const express = require("express");

const router = express.Router();

const userController = require("../../controllers/user/userController");

router.post("/signup", upload.none(), userController.userSignup);

router.post("/login", upload.none(), userController.login);

module.exports = router;         
