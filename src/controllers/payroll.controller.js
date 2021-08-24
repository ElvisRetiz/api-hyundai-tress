const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const chalk = require('chalk');

const Employee = require('../models/employee.model');
const Payroll = require('../models/payroll.model');
const Period = require('../models/period.model');

const { arrayToObject } = require('../helpers/configObjectHandler');

let configArray = fs.readFileSync(path.resolve(process.cwd(),'config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

const controller = {
  getPayrollsByMonth: async (req, res) => {
    try {

      const { year, month, employee } = req.params;
      let payrollsOfMonth = [];

      const employeeFind = await Employee.findOne({
        where: {
          CB_CODIGO: parseInt(employee)
        },
        logging: () => console.log(chalk.green("Successful query to employees"))
      });

      const payrolls = await Payroll.findAll({
        attributes: [
          'PE_NUMERO',
          'PE_TIPO',
          'NO_PERCEPC',
          'NO_DEDUCCI',
          'NO_NETO'
        ],
        where: {
          NO_TIMBRO: 2, //status timbrada
          PE_YEAR: parseInt(year,10),
          CB_CODIGO: parseInt(employee,10),
          $and: Sequelize.literal(`PE_NUMERO in (select PE_NUMERO from PERIODO where PE_MES = ${parseInt(month,10)} and PE_YEAR = ${parseInt(year,10)} and PE_TIPO = ${employeeFind.getDataValue('CB_NOMINA')})`)
        },
        logging: () => console.log(chalk.green("Successful query to payrolls"))
      });

      const periods = await Period.findAll({
        attributes: [
          'PE_NUMERO',
          'PE_TIPO',
          'PE_FEC_PAG'
        ],
        where: {
          PE_YEAR: parseInt(year,10),
          PE_MES: parseInt(month,10),
          PE_TIPO: payrolls[0].getDataValue('PE_TIPO')
        },
        logging: () => console.log(chalk.green("Successful query to periods"))
      });

      for (const payroll of payrolls) {

        let payrollObject = {};

        payrollObject.PERNR = `${employee}`;
        payrollObject.CCODE = config.companyCode;

        let periodOfPayroll = periods.find((period) => (
          period.getDataValue('PE_TIPO') === payroll.getDataValue('PE_TIPO') 
          &&
          period.getDataValue('PE_NUMERO') === payroll.getDataValue('PE_NUMERO')
        ));

        //remove id is necesary
        let date = new Date(periodOfPayroll.getDataValue('PE_FEC_PAG'))
        date.setDate(date.getDate()+1);

        payrollObject.PAYDAY = dayjs(date).format('DD/MM/YYYY');
        payrollObject.PLUS = payroll.getDataValue('NO_PERCEPC');
        payrollObject.MINUS = payroll.getDataValue('NO_DEDUCCI');
        payrollObject.TOTAL = payroll.getDataValue('NO_NETO');

        payrollsOfMonth.push(payrollObject);

      }
      
      return res.send({
        PAYMENTList: payrollsOfMonth,
        IF_RESULT: "S",
        IF_MESSAGE: ""
      });

    } catch (error) {

      console.error(error);

      return res.send({
        PAYMENTList: [],
        IF_RESULT: "E",
        IF_MESSAGE: "No information was found with the specified parameters."
      })
      
    }
  },
  getPayrollsByYear: async (req, res) => {
    try {
      const { year, employee } = req.params;
      let payrollsOfYear = [];
  
      const payrolls = await Payroll.findAll({
        attributes: [
          'PE_NUMERO',
          'PE_TIPO',
          'NO_PERCEPC',
          'NO_DEDUCCI',
          'NO_NETO'
        ],
        where: {
          NO_TIMBRO: 2, //status timbrada
          PE_YEAR: parseInt(year,10),
          CB_CODIGO: parseInt(employee,10)
        },
        logging: () => console.log(chalk.green("Successful query to payrolls"))
      });
  
      const periods = await Period.findAll({
        attributes: [
          'PE_NUMERO',
          'PE_TIPO',
          'PE_FEC_PAG'
        ],
        where: {
          PE_YEAR: parseInt(year,10),
          PE_TIPO: payrolls[0].getDataValue('PE_TIPO')
        },
        logging: () => console.log(chalk.green("Successful query to periods"))
      });
  
      for (const payroll of payrolls) {
  
        let payrollObject = {};
  
        payrollObject.PERNR = `${employee}`;
        payrollObject.CCODE = config.companyCode;
  
        let periodOfPayroll = periods.find((period) => (
          period.getDataValue('PE_TIPO') === payroll.getDataValue('PE_TIPO') 
          &&
          period.getDataValue('PE_NUMERO') === payroll.getDataValue('PE_NUMERO')
        ));
  
        //remove id is necesary
        let date = new Date(periodOfPayroll.getDataValue('PE_FEC_PAG'))
        date.setDate(date.getDate()+1);
  
        payrollObject.PAYDAY = dayjs(date).format('DD/MM/YYYY');
        payrollObject.PLUS = payroll.getDataValue('NO_PERCEPC');
        payrollObject.MINUS = payroll.getDataValue('NO_DEDUCCI');
        payrollObject.TOTAL = payroll.getDataValue('NO_NETO');
  
        payrollsOfYear.push(payrollObject);
  
      }
  
      return res.send({
        PAYMENTList: payrollsOfYear,
        IF_RESULT: "S",
        IF_MESSAGE: ""
      });
    } catch (error) {
      
      return res.send({
        PAYMENTList: [],
        IF_RESULT: "E",
        IF_MESSAGE: "No information was found with the specified parameters."
      });

    }
  }
};

module.exports = controller;