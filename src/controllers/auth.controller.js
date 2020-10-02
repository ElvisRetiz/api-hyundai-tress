const fs = require('fs');
const path = require('path');

const { arrayToObject } = require('../helpers/configObjectHandler');

const Employee = require('../models/employee.model');
const Department = require('../models/department.model');
const Area = require('../models/area.model');
const Subarea = require('../models/subarea.model');
const Type = require('../models/type.model');

let configArray = fs.readFileSync(path.join(__dirname,'../../','config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

const controller = {
  signupEmployee: async (req, res) => {
    try {
      
      const { birthday, nss, rfc, curp } = req.params;
      const employeeNumber = req.params.employee;

      const employee = await Employee.findOne({
        where: {
          CB_CODIGO: employeeNumber
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

      if(employee === null) return res.send({
        found: "N",
        result: "E",
        message: "No employee was found with the information provided."
      });

      let department = await Department.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue('department')
        }
      });
      employee.setDataValue('department', department.dataValues.TB_ELEMENT);

      let area = await Area.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue('area')
        }
      });
      employee.setDataValue('area', area.dataValues.TB_ELEMENT);

      let subarea = await Subarea.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue('subarea')
        }
      });
      employee.setDataValue('subarea', subarea.dataValues.TB_ELEMENT);

      let type = await Type.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue('type')
        }
      });
      employee.setDataValue('type', type.dataValues.TB_ELEMENT);

      employee.setDataValue('found', "Y");
      employee.setDataValue('result', "S");
      employee.setDataValue('message', "Succes");

      return res.send(employee);

    } catch (error) {

      console.error(error);

      return res.send({
        message: "Something goes wrong!"
      })
      
    }
  },
  testFunction: async (req, res) => {
    const { employee, birthday, nss, rfc } = req.params;
    console.log({
      employee,
      birthday,
      nss,
      rfc
    });
    return res.send({
      message: "calis"
    })
  }
};

module.exports = controller;