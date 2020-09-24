const express = require("express");
const controller = require("../controllers/attendance.controller");

const router = express.Router();

router.get("/year=:year&month=:month&employee=:employee",controller.getAttendanceByMonth);

module.exports = router;  