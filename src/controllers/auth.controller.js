const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const dayjs = require('dayjs');

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

      if (birthday !== undefined) {
        let bday = birthday.split('-').reverse().toString().replace(/,/g,'');
        let date = new Date(employee.getDataValue('CB_FEC_NAC'))
        date.setDate(date.getDate()+1);
        if (bday !== dayjs(date).format('YYYYMMDD')) {
          throw new Error();
        }
      };

      if (nss !== undefined) {
        if (nss !== employee.getDataValue('CB_SEGSOC')) {
          throw new Error();
        }
      };

      if (rfc !== undefined) {
        if (rfc !== employee.getDataValue('CB_RFC')) {
          throw new Error();
        }
      };

      if (curp !== undefined) {
        if (curp !== employee.getDataValue('CB_CURP')) {
          throw new Error();
        }
      };

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

      setAndDeletePropertyWithNewValue(employee,`CB_${config.department}`,'ZMORGTX05',department.getDataValue('TB_ELEMENT'));

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

      let subarea = await Subarea.findOne({
        attributes: [
          'PU_DESCRIP'
        ],
        where: {
          PU_CODIGO: employee.getDataValue(`CB_${config.subarea}`)
        },
        logging: () => console.log(chalk.green("Successful query to subarea"))
      });

      if(subarea === null) return res.send({
        FOUND: "N",
        EMPLOYEE: null,
        IF_RESULT: "E",
        IF_MESSAGE: "The request did not return information."
      });

      setAndDeletePropertyWithNewValue(employee,`CB_${config.subarea}`,'SAREA',subarea.getDataValue('PU_DESCRIP'));

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