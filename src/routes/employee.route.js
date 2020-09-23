const express = require("express");
const controller = require("../controllers/employee.controller");

const router = express.Router();

router.get("/",controller.getAllEmployees);
// router.get("/photos", employeesController.getAllEmployeesPhoto);

module.exports = router;