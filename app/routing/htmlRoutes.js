const express = require("express");
const path = require("path");
const router = express.Router();

router.use("/survey", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/survey.html'));
});

router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

module.exports = router;