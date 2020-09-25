const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const employeeRoute = require("./routes/employee.route");
const authRoute = require('./routes/auth.route');
const attendanceRoute = require('./routes/attendance.route');
const payrollRoute = require('./routes/payroll.route');

app.use("/api/employee", employeeRoute);
app.use("/api/auth", authRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/payroll", payrollRoute);

module.exports = app;