const dayjs = require('dayjs');

const Employee = require('../models/employee.model');

const config = require('../../config');

const controller = {
  getAllEmployees: async (req, res) => {
    try {

      const employees = await Employee.findAll({
        where: {
          CB_ACTIVO: 'S'
        },
        attributes:[
          ['CB_CODIGO', 'number']
        ]
      });

      employees.forEach((employee, index) => {
        employee.setDataValue('ccode', config.companyCode);
        employee.setDataValue('exec', dayjs().format('DD/MM/YYYY'));
        employee.setDataValue('index', index+1);
      });

      return res.send(employees);

    } catch (error) {

      console.error(error);

      return res.send({
        message: "Something goes wrong!"
      })
      
    }
  }
};

module.exports = controller;