const express = require("express");
const controller = require("../controllers/auth.controller");

const router = express.Router();

router.get("/CCODE=:companyc?&PERNR=:employee?&GBDAT=:birthday?&NIMSS=:nss?&NURFC=:rfc?&NCURP=:curp?",controller.signupEmployee);
router.get("/CCODE=:companyc?&PERNR=:employee?&GBDAT=:birthday?&NIMSS=:nss?&NURFC=:rfc?",controller.signupEmployee);
router.get("/CCODE=:companyc?&PERNR=:employee?&GBDAT=:birthday?&NIMSS=:nss?",controller.signupEmployee);
router.get("/CCODE=:companyc?&PERNR=:employee?&GBDAT=:birthday",controller.signupEmployee);
router.get("/CCODE=:companyc?&PERNR=:employee?",controller.signupEmployee);

module.exports = router;  