const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const express = require("express");

const ProgramController = require("../../controllers/user/programController");

const router = express.Router();
const userAuth = require("../../middleware/userAuth");

router.post(
  "/post-department",
  upload.none(),
  ProgramController.postDepartment
);

router.post("/post-skills", upload.none(), ProgramController.postSkills);

router.post(
  "/post-designation",
  upload.none(),
  ProgramController.postDesignation
);

router.get(
  "/get-depts-skills-dsgntn",
  upload.none(),
  ProgramController.getDeptSkillsDesgntn
);

router.post("/post-program", ProgramController.postProgramWithActions);
router.post("/post-team", ProgramController.postTeam);

router.post(
  "/post-program-assigned",
  userAuth.authorization,
  ProgramController.postProgramAssigned
);

router.post(
  "/post-actions",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  userAuth.authorization,
  ProgramController.postAction
);

router.get(
  "/get-user-programs",
  userAuth.authorization,
  ProgramController.getUserPrograms
);

router.get("/get-home", userAuth.authorization, ProgramController.getHome);

router.get(
  "/get-user-actions/:programId",
  userAuth.authorization,
  ProgramController.getUserActions
);

router.get(
  "/get-user-streaks",
  userAuth.authorization,
  ProgramController.streaksCalculation
);

router.post("/post-shape", ProgramController.storeShapes);

router.get("/get-shapes", ProgramController.getShapes);

router.post(
  "/store-user-towerData",
  userAuth.authorization,
  ProgramController.addShapetoTower
);

router.get(
  "/get-user-tower",
  userAuth.authorization,
  ProgramController.getAllUserTowerData
);

router.get(
  "/get-program-streaks",
  userAuth.authorization,
  ProgramController.calculateProgramStreak
);

module.exports = router;
