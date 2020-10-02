const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const chalk = require('chalk');
const { encode } = require('base64-arraybuffer');

const { arrayToObject } = require('../helpers/configObjectHandler');

const Employee = require('../models/employee.model');
const Photo = require('../models/photo.model');

let configArray = fs.readFileSync(path.join(__dirname,'../../','config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

const controller = {
  getAllEmployees: async (req, res) => {
    try {

      const employees = await Employee.findAll({
        where: {
          CB_ACTIVO: 'S'
        },
        attributes:[
          ['CB_CODIGO', 'number']
        ],
        logging: () => console.log(chalk.green("Successful query to employees"))
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