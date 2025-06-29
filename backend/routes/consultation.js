const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultationController");

router.post("/save", consultationController.saveConsultation);
router.get("/history", consultationController.getConsultationHistory);
router.get("/:id", consultationController.getConsultationById);

module.exports = router;
