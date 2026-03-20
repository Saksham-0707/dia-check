const express = require("express");

const { updateConsent } = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.post("/consent", updateConsent);

module.exports = router;
