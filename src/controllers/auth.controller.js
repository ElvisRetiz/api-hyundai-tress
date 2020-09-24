const Employee = require('../models/employee.model');
const Department = require('../models/department.model');
const Area = require('../models/area.model');
const Subarea = require('../models/subarea.model');
const Type = require('../models/type.model');

const config = require('../config');

const controller = {
  signupEmployee: async (req, res) => {
    try {

      let employeeIndex = 1

      const employees = await Employee.findAll({
        where: {
          CB_ACTIVO: 'S'
        },
        attributes:[
          ['CB_CODIGO', 'number'],
          ['PRETTYNAME', 'name'],
          [`CB_${config.department}`, 'department'],
          [`CB_${config.area}`, 'area'],
          [`CB_${config.subarea}`, 'subarea'],
          [`CB_${config.employeeType}`, 'type']
        ]
      });

      for (const employee of employees) {
        let department = await Department.findOne({
          attributes: [
            'TB_ELEMENT'
          ],
          where: {
            TB_CODIGO: employee.getDataValue('department')
          }
        })
        employee.setDataValue('department', department.dataValues.TB_ELEMENT);

        let area = await Area.findOne({
          attributes: [
            'TB_ELEMENT'
          ],
          where: {
            TB_CODIGO: employee.getDataValue('area')
          }
        })
        employee.setDataValue('area', area.dataValues.TB_ELEMENT);

        employee.setDataValue('index', employeeIndex)
        employeeIndex++
      }

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