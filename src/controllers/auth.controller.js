const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const { arrayToObject } = require('../helpers/configObjectHandler');

const Employee = require('../models/employee.model');
const Department = require('../models/department.model');
const Area = require('../models/area.model');
const Subarea = require('../models/subarea.model');
const Type = require('../models/type.model');

let configArray = fs.readFileSync(path.resolve(process.cwd(),'config/data.config')).toString().split(',');
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
        ],
        logging: () => console.log(chalk.green("Successful query to employee"))
      });

      if(employee === null) return res.send({
        message: "No information was found with the specified parameters",
        data: {
          found: "N",
          result: "E"
        }
      });

      let department = await Department.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue('department')
        },
        logging: () => console.log(chalk.green("Successful query to departmen"))
      });

      if(department === null) return res.send({
        message: "No information was found with the specified parameters",
        data: {
          found: "N",
          result: "E"
        }
      });

      employee.setDataValue('department', department.dataValues.TB_ELEMENT);

      let area = await Area.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue('area')
        },
        logging: () => console.log(chalk.green("Successful query to area"))
      });

      if(area === null) return res.send({
        message: "No information was found with the specified parameters",
        data: {
          found: "N",
          result: "E"
        }
      });

      employee.setDataValue('area', area.dataValues.TB_ELEMENT);

      let subarea = await Subarea.findOne({
        attributes: [
          'PU_DESCRIP'
        ],
        where: {
          PU_CODIGO: employee.getDataValue('subarea')
        },
        logging: () => console.log(chalk.green("Successful query to subarea"))
      });

      if(subarea === null) return res.send({
        message: "No information was found with the specified parameters",
        data: {
          found: "N",
          result: "E"
        }
      });

      employee.setDataValue('subarea', subarea.dataValues.TB_ELEMENT);

      let type = await Type.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue('type')
        },
        logging: () => console.log(chalk.green("Successful query to type"))
      });

      if(type === null) return res.send({
        message: "No information was found with the specified parameters",
        data: {
          found: "N",
          result: "E"
        }
      });

      employee.setDataValue('type', type.dataValues.TB_ELEMENT);

      employee.setDataValue('found', "Y");
      employee.setDataValue('result', "S");

      return res.send({
        message: "Succes.",
        data: employee
      });

    } catch (error) {

      console.error(error);

      return res.send({
        message: "No information was found with the specified parameters",
        data: {
          found: "N",
          result: "E"
        }
      })
      
    }
  }
};

module.exports = controller;