const express = require("express");
const controller = require("../controllers/payslip.controller");

const router = express.Router();

router.get("/CCODE=:companyc&PERNR=:employee&PAYDAY=:day/:month/:year",controller.getPayslip);
router.get("/CCODE=:companyc&PERNR=:employee&PAYDAY=:paydate",controller.getPayslip);

module.exports = router;