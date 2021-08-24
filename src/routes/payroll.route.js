const express = require("express");
const controller = require("../controllers/payroll.controller");

const router = express.Router();

router.get("/CCODE=:companyc&YEAR=:year&PERNR=:employee",controller.getPayrollsByYear);
router.get("/CCODE=:companyc&YEAR=:year&PERIOD=:month&PERNR=:employee",controller.getPayrollsByMonth);

module.exports = router;