const express = require("express");
const controller = require("../controllers/auth.controller");

const router = express.Router();

router.get("/employee=:employee?&birthday=:birthday?&nss=:nss?&rfc=:rfc?&curp=:curp?",controller.signupEmployee);

module.exports = router;  