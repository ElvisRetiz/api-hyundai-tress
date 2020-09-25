const dayjs = require('dayjs');
const Sequelize = require('sequelize');

const config = require('../config');

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
      })

      return res.send({
        payroll,
        period,
        employee,
        businessName,
        company,
        costCenter,
        concepts,
        movements
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