const express = require("express");
const controller = require("../controllers/attendance.controller");

const router = express.Router();

router.get("/CCODE=:companyc&YEAR=:year&PERIOD=:month&PERNR=:employee",controller.getAttendanceByMonth);

module.exports = router;  