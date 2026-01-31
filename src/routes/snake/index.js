const express = require("express");

const getBestScore = require("./getBestScore");
const submitScore = require("./submitScore");

const router = express.Router();

router.get("/best-score", getBestScore);
router.post("/submit-score", submitScore);

module.exports = router;
