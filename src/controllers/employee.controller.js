const Employee = require('../models/employee.model');
const config = require('../config');

const controller = {
  getAllEmployees: async (req, res) => {
    try {
      
      const employees = await Employee.findAll({
        where: {
          CB_ACTIVO: 'S'
        },
        attributes:[
          ['CB_CODIGO', 'number'],
          ['PRETTYNAME', 'name'],
          [`${config.department}`, 'department'],
          [`${config.area}`, 'area'],
          [`${config.subarea}`, 'subarea'],
          [`${config.employeeType}`, 'type']
        ]
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