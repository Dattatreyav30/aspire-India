const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const express = require("express");

const Department = require("../../controllers/user/programController");

const router = express.Router();

router.post('/post-department',)

module.exports = router;
