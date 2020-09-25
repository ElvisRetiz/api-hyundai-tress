const express = require("express");
const controller = require("../controllers/payroll.controller");

const router = express.Router();

router.get("/year=:year&month=:month&employee=:employee",controller.getPayrollsByMonth);

module.exports = router;