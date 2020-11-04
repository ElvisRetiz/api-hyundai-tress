const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const chalk = require('chalk');
const { encode } = require('base64-arraybuffer');

const { arrayToObject, setAndDeleteProperty, setAndDeleteDateProperty, setAndDeletePropertyWithNewValue } = require('../helpers/configObjectHandler');
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
  getAllEmployees: async (req, res) => {
    try {

      const employees = await Employee.findAll({
        where: {
          CB_ACTIVO: 'S'
        },
        logging: () => console.log(chalk.green("Successful query to employees"))
      });

      const businessNames = await BusinessName.findAll({
        logging: () => console.log(chalk.green("Successful query to buisiness name"))
      });

      const companies = await Company.findAll({
        logging: () => console.log(chalk.green("Successful query to company"))
      });

      let departments = await Department.findAll({
        logging: () => console.log(chalk.green("Successful query to departmens"))
      });

      let areas = await Area.findAll({
        logging: () => console.log(chalk.green("Successful query to areas"))
      });

      let subareas = await Subarea.findAll({
        logging: () => console.log(chalk.green("Successful query to subareas"))
      });

      let types = await Type.findAll({
        logging: () => console.log(chalk.green("Successful query to types"))
      });

      const photos = await Photo.findAll({
        attributes: [
          'CB_CODIGO',
          'IM_BLOB'
        ],
        where: {
          IM_TIPO: "FOTO"
        },
        logging: () => console.log(chalk.green("Successful query to photos"))
      });

      employees.forEach((employee, index) => {
        employee.setDataValue('CCODE', config.companyCode);
        
        setAndDeleteProperty(employee,'CB_CODIGO','PERNR');
        setAndDeleteDateProperty(employee,'CB_FEC_NAC','GBDAT');
        setAndDeleteProperty(employee,'CB_SEGSOC','NIMSS');
        setAndDeleteProperty(employee,'CB_RFC','NURFC');
        setAndDeleteProperty(employee,'CB_CURP','NCURP');
        setAndDeletePropertyWithNewValue(employee,'PRETTYNAME','ENAME',format(employee.getDataValue('PRETTYNAME')));

        let businessName = businessNames.find(element => element.getDataValue('TB_CODIGO') === employee.getDataValue('CB_PATRON'));
        let company = companies.find(element => element.getDataValue('RS_CODIGO') === businessName.getDataValue('RS_CODIGO'));
        setAndDeletePropertyWithNewValue(employee,'CB_PATRON','BTEXT',company.getDataValue('RS_CIUDAD'));
        
        let departmen = departments.find(element => element.getDataValue('TB_CODIGO') === employee.getDataValue(`CB_${config.department}`));
        setAndDeletePropertyWithNewValue(employee,`CB_${config.department}`,'ZMORGTX05',departmen.getDataValue('TB_ELEMENT'));

        let area = areas.find(element => element.getDataValue('TB_CODIGO') === employee.getDataValue(`CB_${config.area}`));
        setAndDeletePropertyWithNewValue(employee,`CB_${config.area}`,'AREA',area.getDataValue('TB_ELEMENT'));

        let subarea = subareas.find(element => element.getDataValue('PU_CODIGO') === employee.getDataValue(`CB_${config.subarea}`));
        setAndDeletePropertyWithNewValue(employee,`CB_${config.subarea}`,'SAREA',subarea.getDataValue('PU_DESCRIP'));

        let type = types.find(element => element.getDataValue('TB_CODIGO') === employee.getDataValue(`CB_${config.employeeType}`));
        setAndDeletePropertyWithNewValue(employee,`CB_${config.employeeType}`,'PTEXT',type ===  undefined ? "" : type.getDataValue('TB_ELEMENT'));

        let photo = photos.find(element => element.getDataValue('CB_CODIGO') === employee.getDataValue('PERNR'));
        employee.setDataValue('PHOTO64', photo === undefined ? "" : encode(photo.getDataValue('IM_BLOB')));

        employee.setDataValue('EXEC', dayjs().format('DD/MM/YYYY'));
        employee.setDataValue('INDEX', index+1);

        delete employee.dataValues.CB_ACTIVO;
        delete employee.dataValues.CB_FEC_ANT;
        delete employee.dataValues.CB_FEC_ING;
        delete employee.dataValues.CB_INFCRED;
      });

      return res.send({
        message: "Succes.",
        data: employees
      });

    } catch (error) {

      console.error(error);

      return res.send({
        message: "The request did not return information.",
        data: []
      });
      
    }
  },
  getAllPhotos: async (req, res) => {

    try {

      let employeesPhotos = [];

      const employees = await Employee.findAll({
        where: {
          CB_ACTIVO: 'S'
        },
        attributes:[
          'CB_CODIGO'
        ],
        logging: () => console.log(chalk.green("Successful query to employees"))
      });

      const employeesNumber = employees.map( emp => emp.getDataValue('CB_CODIGO'));

      const photos = await Photo.findAll({
        attributes: [
          'CB_CODIGO',
          'IM_BLOB'
        ],
        where: {
          IM_TIPO: "FOTO",
          CB_CODIGO: employeesNumber
        }
      });

      for (const photo of photos) {
        let employeesObject = {};
        employeesObject.companyCode = config.companyCode;
        employeesObject.number = photo.getDataValue('CB_CODIGO');
        employeesObject.photo = encode(photo.getDataValue('IM_BLOB'));
        employeesPhotos.push(employeesObject);
      }

      return res.send(employeesPhotos);

    } catch (error) {

      return res.send({
        message: "Something goes wrong!"
      });
      
    }

  }
};

module.exports = controller;