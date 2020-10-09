const express = require("express");
const controller = require("../controllers/home.controller");

const router = express.Router();

router.get("/",controller.getAllRoutes);
router.get("/test", controller.tasteDB);

module.exports = router;