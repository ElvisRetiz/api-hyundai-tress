const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const convertir = require('numero-a-letras');
const chalk = require('chalk');

const { arrayToObject } = require('../helpers/configObjectHandler')

let configArray = fs.readFileSync(path.resolve(process.cwd(),'config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

const PortableDocumentFormat = require('../helpers/PortableDocumentFormat');
const { pdfGenerator } = require('../helpers/promiseHandler')
const { addDay } = require('../helpers/dateHandler');
const { format } = require('../helpers/amountsHandler');

const Period = require('../models/period.model');
const Payroll = require('../models/payroll.model');
const Employee = require('../models/employee.model');
const BusinessName = require('../models/business-name.model');
const Company = require('../models/company.model');
const CostCenter = require('../models/cost-center.model');
const Concept = require('../models/concepts.model');
const Movement = require('../models/movement.model');

const controller = {
  getPayslip: async (req, res) => {
    try {

      const { day, month, year, paydate } = req.params;
      const employeeNumber = req.params.employee;
      const conceptsNumber = config.includeBenefits.toUpperCase() === 'Y' ? '1,2,3,4' : '1,2';

      let date;
      
      if(paydate) {
        date = paydate.split("-");
        date = `${date[2]}${date[1]}${date[0]}` 
      }else {
        date = `${year}${month}${day}`;
      }

      const employee = await Employee.findOne({
        attributes: [
          'PRETTYNAME',
          'CB_PATRON',
          'CB_FEC_ANT',
          'CB_FEC_ING',
          'CB_SEGSOC',
          'CB_RFC',
          'CB_CURP',
          'CB_INFCRED',
          'CB_NOMINA'
        ],
        where: {
          CB_CODIGO: parseInt(employeeNumber, 10)
        },
        logging: () => console.log(chalk.green("Successful query to employee"))
      });

      const period = await Period.findOne({
        where: {
          PE_FEC_PAG: date,
          PE_TIPO: employee.getDataValue('CB_NOMINA')
        },
        logging: () => console.log(chalk.green("Successful query to period"))
      });

      const payroll = await Payroll.findOne({
        where: {
          PE_YEAR: period.getDataValue('PE_YEAR'),
          PE_TIPO: period.getDataValue('PE_TIPO'),
          PE_NUMERO: period.getDataValue('PE_NUMERO'),
          CB_CODIGO: parseInt(employeeNumber, 10)
        },
        logging: () => console.log(chalk.green("Successful query to payroll"))
      });

      const businessName = await BusinessName.findOne({
        where: {
          TB_CODIGO: employee.getDataValue('CB_PATRON')
        },
        logging: () => console.log(chalk.green("Successful query to buisiness name"))
      });

      const company = await Company.findOne({
        where: {
          RS_CODIGO: businessName.getDataValue('RS_CODIGO')
        },
        logging: () => console.log(chalk.green("Successful query to company"))
      });

      const costCenter = await CostCenter.findOne({
        where: {
          TB_CODIGO: payroll.getDataValue(`CB_${config.costCenter}`)
        },
        logging: () => console.log(chalk.green("Successful query to cost center"))
      });

      const concepts = await Concept.findAll({
        where: {
          CO_IMPRIME: 'S'
        },
        logging: () => console.log(chalk.green("Successful query to concepts"))
      });

      const movements = await Movement.findAll({
        where: {
          PE_YEAR: period.getDataValue('PE_YEAR'),
          PE_NUMERO: period.getDataValue('PE_NUMERO'),
          PE_TIPO: period.getDataValue('PE_TIPO'),
          CB_CODIGO: parseInt(employeeNumber, 10),
          $and: Sequelize.literal(`CO_NUMERO in (select CO_NUMERO from CONCEPTO where CO_IMPRIME = 'S' and CO_TIPO in (${conceptsNumber}))`)
        },
        logging: () => console.log(chalk.green("Successful query to movements"))
      });

      console.log(chalk.white("Initializing payroll info"))
      let payrollInfo = {};
      payrollInfo.perceptions =format(payroll.getDataValue('NO_PERCEPC'));
      payrollInfo.deductions = format(payroll.getDataValue('NO_DEDUCCI'));
      payrollInfo.total = format(payroll.getDataValue('NO_NETO'));
      payrollInfo.totalInText = convertir.NumerosALetras(payroll.getDataValue('NO_NETO'));
      payrollInfo.dailySalary = format(payroll.getDataValue('CB_SALARIO'));
      payrollInfo.integratedSalary = format(payroll.getDataValue('CB_SAL_INT'));
      payrollInfo.initialDate = dayjs(addDay(period.getDataValue('PE_FEC_INI'))).format('DD/MM/YYYY');
      payrollInfo.finalDate = dayjs(addDay(period.getDataValue('PE_FEC_FIN'))).format('DD/MM/YYYY');
      payrollInfo.payDate = dayjs(addDay(period.getDataValue('PE_FEC_PAG'))).format('DD/MM/YYYY');
      payrollInfo.periodNumber = payroll.getDataValue('PE_NUMERO');
      payrollInfo.employeeName = employee.getDataValue('PRETTYNAME');
      payrollInfo.employeeNumber = employeeNumber;
      payrollInfo.seniorityDate = dayjs(addDay(employee.getDataValue('CB_FEC_ANT'))).format('DD/MM/YYYY');
      payrollInfo.admissionDate = dayjs(addDay(employee.getDataValue('CB_FEC_ING'))).format('DD/MM/YYYY');
      payrollInfo.nss = employee.getDataValue('CB_SEGSOC');
      payrollInfo.rfc = employee.getDataValue('CB_RFC');
      payrollInfo.curp = employee.getDataValue('CB_CURP');
      payrollInfo.creditNumber = employee.getDataValue('CB_INFCRED');
      payrollInfo.numReg = businessName.getDataValue('TB_NUMREG');
      payrollInfo.companyName = company.getDataValue('RS_NOMBRE');
      payrollInfo.companyAddress = `${company.getDataValue('RS_CALLE')}, ${company.getDataValue('RS_NUMEXT')}, ${company.getDataValue('RS_COLONIA')}, ${company.getDataValue('RS_CIUDAD')}`;
      payrollInfo.companyRfc = company.getDataValue('RS_RFC');
      payrollInfo.costCenter = costCenter.getDataValue('TB_ELEMENT');
      console.log(chalk.green("Payroll info initialized"))

      console.log(chalk.white("Initializing payroll mov"))
      let payrollMovements = [];
      for (const movement of movements) {
        let concept = concepts.filter(c => c.getDataValue('CO_NUMERO') === movement.getDataValue('CO_NUMERO'));
        let conceptObject = {};
        conceptObject.number = concept[0].getDataValue('CO_NUMERO');
        conceptObject.description = concept[0].getDataValue('CO_DESCRIP');
        conceptObject.type = movement.getDataValue('MO_PERCEPC') > 0 || movement.getDataValue('MO_DEDUCCI') < 0 ? "plus" : "minus";
        conceptObject.amount =  Math.abs(movement.getDataValue('MO_DEDUCCI')) > 0 ? format(movement.getDataValue('MO_DEDUCCI')) : format(movement.getDataValue('MO_PERCEPC'));
        payrollMovements.push(conceptObject);
      }
      console.log(chalk.green("Payroll mov initialized"))

      console.log(chalk.white("Initializing payroll detail"))
      let detail = new PortableDocumentFormat(payrollInfo,payrollMovements);
      let detailHTML  = detail.getContent();
      console.log(chalk.green("Payroll detail initialized"))

      console.log(chalk.white("Initializing payroll pdf"))
      const pdf = await pdfGenerator(detailHTML);
      console.log(chalk.green("Payroll pdf initialized"))

      return res.send({
        PAYSLIPBINFILE: pdf,
        IF_RESULT: "S",
        IF_MESSAGE: ""
      });

    } catch (error) {

      console.error(error);

      return res.send({
        PAYSLIPBINFILE: null,
        IF_RESULT: "E",
        IF_MESSAGE: "No information was found with the specified parameters."
      })
      
    }
  }
};

module.exports = controller;