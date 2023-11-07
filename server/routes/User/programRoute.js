const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const express = require("express");

const ProgramController = require("../../controllers/user/programController");

const router = express.Router();

router.post("/post-department", upload.none(), ProgramController.postDepartment);

router.post("/post-skills", upload.none(), ProgramController.postSkills);

router.post("/post-designation", upload.none(), ProgramController.postDesignation);

router.get("/get-depts-skills-dsgntn",upload.none(),ProgramController.getDeptSkillsDesgntn)

module.exports = router;
