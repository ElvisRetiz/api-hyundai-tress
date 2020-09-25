const dayjs = require('dayjs');
const Sequelize = require('sequelize');

const Payroll = require('../models/payroll.model');
const Period = require('../models/period.model');

const controller = {
  getPayrollsByMonth: async (req, res) => {
    try {

      const { year, month, employee } = req.params;
      let payrollsOfMonth = [];

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
          $and: Sequelize.literal(`PE_NUMERO in (select PE_NUMERO from PERIODO where PE_MES = ${parseInt(month,10)} and PE_YEAR = ${parseInt(year,10)})`)
        }
      });

      const periods = await Period.findAll({
        attributes: [
          'PE_NUMERO',
          'PE_TIPO',
          'PE_FEC_PAG'
        ],
        where: {
          PE_YEAR: parseInt(year,10),
          PE_MES: parseInt(month,10)
        }
      });

      for (const payroll of payrolls) {

        let payrollObject = {}
        
        let periodOfPayroll = periods.filter((period) => (
          period.getDataValue('PE_TIPO') === payroll.getDataValue('PE_TIPO') 
          &&
          period.getDataValue('PE_NUMERO') === payroll.getDataValue('PE_NUMERO')
        ));

        //remove id is necesary
        let date = new Date(periodOfPayroll[0].getDataValue('PE_FEC_PAG'))
        date.setDate(date.getDate()+1);

        payrollObject.payday = dayjs(date).format('DD/MM/YYYY');
        payrollObject.plus = payroll.getDataValue('NO_PERCEPC');
        payrollObject.minus = payroll.getDataValue('NO_DEDUCCI');
        payrollObject.total = payroll.getDataValue('NO_NETO');

        payrollsOfMonth.push(payrollObject);

      }
      
      return res.send(payrollsOfMonth);

    } catch (error) {

      console.error(error);

      return res.send({
        message: "Something goes wrong!"
      })
      
    }
  }
};

module.exports = controller;