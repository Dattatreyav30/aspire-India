const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const express = require("express");

const Department = require("../../controllers/user/programController");

const router = express.Router();

router.post("/post-department", upload.none(), Department.postDepartment);

router.post("/post-skills", upload.none(), Department.postSkills);

router.post("/post-designation", upload.none(), Department.postDesignation);

module.exports = router;
