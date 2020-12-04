const express = require("express");
const controller = require("../controllers/home.controller");

const router = express.Router();

router.get("/",controller.getStatus);
router.get("/home",controller.getAllRoutes);
router.get("/test", controller.tasteDB);

module.exports = router;