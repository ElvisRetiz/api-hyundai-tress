const express = require("express");
const controller = require("../controllers/payslip.controller");

const router = express.Router();

router.get("/employee=:employee&paydate=:day/:month/:year",controller.getPayslip);
router.get("/employee=:employee&paydate=:paydate",controller.getPayslip);

module.exports = router;