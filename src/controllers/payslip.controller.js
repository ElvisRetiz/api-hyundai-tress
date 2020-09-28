const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const convertir = require('numero-a-letras')

const config = require('../config');
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
      let date;
      
      if(paydate) {
        date = paydate.split("-");
        date = `${date[2]}${date[1]}${date[0]}` 
      }else {
        date = `${year}${month}${day}`;
      }

      const period = await Period.findOne({
        where: {
          PE_FEC_PAG: date
        }
      });

      const payroll = await Payroll.findOne({
        where: {
          PE_YEAR: period.getDataValue('PE_YEAR'),
          PE_TIPO: period.getDataValue('PE_TIPO'),
          PE_NUMERO: period.getDataValue('PE_NUMERO'),
          CB_CODIGO: parseInt(employeeNumber, 10)
        }
      });

      const employee = await Employee.findOne({
        attributes: [
          'PRETTYNAME',
          'CB_PATRON',
          'CB_FEC_ANT',
          'CB_FEC_ING',
          'CB_SEGSOC',
          'CB_RFC',
          'CB_CURP',
          'CB_INFCRED'
        ],
        where: {
          CB_CODIGO: parseInt(employeeNumber, 10)
        }
      });

      const businessName = await BusinessName.findOne({
        where: {
          TB_CODIGO: employee.getDataValue('CB_PATRON')
        }
      });

      const company = await Company.findOne({
        where: {
          RS_CODIGO: businessName.getDataValue('RS_CODIGO')
        }
      });

      const costCenter = await CostCenter.findOne({
        where: {
          TB_CODIGO: payroll.getDataValue(`CB_${config.costCenter}`)
        }
      });

      const concepts = await Concept.findAll({
        where: {
          CO_IMPRIME: 'S'
        }
      });

      const movements = await Movement.findAll({
        where: {
          PE_YEAR: period.getDataValue('PE_YEAR'),
          PE_NUMERO: period.getDataValue('PE_NUMERO'),
          PE_TIPO: period.getDataValue('PE_TIPO'),
          CB_CODIGO: parseInt(employeeNumber, 10),
          $and: Sequelize.literal("CO_NUMERO in (select CO_NUMERO from CONCEPTO where CO_IMPRIME = 'S')")
        }
      });

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
      payrollInfo.employeeName = employee.getDataValue('PRETTYNAME');
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

      return res.send({
        payroll,
        period,
        employee,
        businessName,
        company,
        costCenter,
        concepts,
        movements,
        payrollInfo,
        payrollMovements
      });

    } catch (error) {

      console.error(error);

      return res.send({
        message: "Something goes wrong!"
      })
      
    }
  }
};

module.exports = controller;