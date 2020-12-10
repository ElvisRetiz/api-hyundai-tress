const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { encode } = require('base64-arraybuffer');

const { arrayToObject, setAndDeletePropertyWithNewValue, setAndDeleteProperty, setAndDeleteDateProperty } = require('../helpers/configObjectHandler');
const { format } = require('../helpers/stringsHandler');

const Employee = require('../models/employee.model');
const Department = require('../models/department.model');
const Area = require('../models/area.model');
const Subarea = require('../models/subarea.model');
const Type = require('../models/type.model');
const BusinessName = require('../models/business-name.model');
const Company = require('../models/company.model');
const Photo = require('../models/photo.model');

let configArray = fs.readFileSync(path.resolve(process.cwd(),'config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

const controller = {
  signupEmployee: async (req, res) => {
    try {
      
      const { companyc, birthday, nss, rfc, curp } = req.params;
      const employeeNumber = req.params.employee;

      const employee = await Employee.findOne({
        where: {
          CB_CODIGO: employeeNumber
        },
        logging: () => console.log(chalk.green("Successful query to employee"))
      });

      if(employee === null) return res.send({
        FOUND: "N",
        EMPLOYEE: null,
        IF_RESULT: "E",
        IF_MESSAGE: "The request did not return information."
      });

      setAndDeletePropertyWithNewValue(employee,'CB_CODIGO','PERNR',employee.getDataValue('CB_CODIGO').toString());
      setAndDeleteDateProperty(employee,'CB_FEC_NAC','GBDAT');
      setAndDeleteProperty(employee,'CB_SEGSOC','NIMSS');
      setAndDeleteProperty(employee,'CB_RFC','NURFC');
      setAndDeleteProperty(employee,'CB_CURP','NCURP');
      setAndDeletePropertyWithNewValue(employee,'PRETTYNAME','ENAME',format(employee.getDataValue('PRETTYNAME')));

      const businessNames = await BusinessName.findAll({
        logging: () => console.log(chalk.green("Successful query to buisiness name"))
      });

      const companies = await Company.findAll({
        logging: () => console.log(chalk.green("Successful query to company"))
      });

      let businessName = businessNames.find(element => element.getDataValue('TB_CODIGO') === employee.getDataValue('CB_PATRON'));
      let company = companies.find(element => element.getDataValue('RS_CODIGO') === businessName.getDataValue('RS_CODIGO'));
      setAndDeletePropertyWithNewValue(employee,'CB_PATRON','BTEXT',company.getDataValue('RS_CIUDAD'));

      let department = await Department.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue(`CB_${config.department}`)
        },
        logging: () => console.log(chalk.green("Successful query to departmen"))
      });

      if(department === null) return res.send({
        FOUND: "N",
        EMPLOYEE: null,
        IF_RESULT: "E",
        IF_MESSAGE: "The request did not return information."
      });

      let area = await Area.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue(`CB_${config.area}`)
        },
        logging: () => console.log(chalk.green("Successful query to area"))
      });

      if(area === null) return res.send({
        FOUND: "N",
        EMPLOYEE: null,
        IF_RESULT: "E",
        IF_MESSAGE: "The request did not return information."
      });

      setAndDeletePropertyWithNewValue(employee,`CB_${config.area}`,'AREA',area.getDataValue('TB_ELEMENT'));
      setAndDeletePropertyWithNewValue(employee,`CB_${config.department}`,'ZMORGTX05',department.getDataValue('TB_ELEMENT'));

      let subarea = await Subarea.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue(`CB_${config.subarea}`)
        },
        logging: () => console.log(chalk.green("Successful query to subarea"))
      });

      if(subarea === null) return res.send({
        FOUND: "N",
        EMPLOYEE: null,
        IF_RESULT: "E",
        IF_MESSAGE: "The request did not return information."
      });

      setAndDeletePropertyWithNewValue(employee,`CB_${config.subarea}`,'SAREA',subarea.getDataValue('TB_ELEMENT'));

      let type = await Type.findOne({
        attributes: [
          'TB_ELEMENT'
        ],
        where: {
          TB_CODIGO: employee.getDataValue(`CB_${config.employeeType}`)
        },
        logging: () => console.log(chalk.green("Successful query to type"))
      });

      setAndDeletePropertyWithNewValue(employee,`CB_${config.employeeType}`,'PTEXT',type === null ? null : type.getDataValue('TB_ELEMENT'));

      employee.setDataValue('FOUND', 'Y');
      employee.setDataValue('RESULT', 'S');

      delete employee.dataValues.CB_NOMINA;
      delete employee.dataValues.CB_ACTIVO;
      delete employee.dataValues.CB_FEC_ANT;
      delete employee.dataValues.CB_FEC_ING;
      delete employee.dataValues.CB_INFCRED;

      return res.send({
        FOUND: "Y",
        EMPLOYEE: employee,
        IF_RESULT: "S",
        IF_MESSAGE: ""
      });

    } catch (error) {

      console.error(error);

      return res.send({
        FOUND: "N",
        EMPLOYEE: null,
        IF_RESULT: "E",
        IF_MESSAGE: "The request did not return information."
      })
      
    }
  }
};

module.exports = controller;