const express = require("express");
const router = express.Router();
const expertSystemController = require("../controllers/expertSystemController");

router.get("/symptoms", expertSystemController.getSymptoms);
router.get("/rules", expertSystemController.getRules);
router.post("/diagnose", expertSystemController.processDiagnosis);

module.exports = router;
