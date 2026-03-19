const express = require("express");

const { predict, getHistory, getRecordById } = require("../controllers/diabetesController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.post("/predict", predict);
router.get("/history", getHistory);
router.get("/:id", getRecordById);

module.exports = router;
