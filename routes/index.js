const express = require("express");

const router = express.router();

const controller = require("../controllers/index");

router.get("/", controller.index);

module.exports = router;
