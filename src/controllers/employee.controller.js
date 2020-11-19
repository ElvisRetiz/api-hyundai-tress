const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { encode } = require('base64-arraybuffer');

const { arrayToObject } = require('../helpers/configObjectHandler');

let configArray = fs.readFileSync(path.resolve(process.cwd(),'config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

const sequelize = require('../db/index');

const controller = {
  getAllEmployees: async (req, res) => {
    try {

      const result = await sequelize.query(`
      select 
        PERNR=CAST(C.cb_codigo AS varchar),
        GBDAT=FORMAT(C.cb_fec_nac,'d','en-gb'),
        NIMSS=C.cb_segsoc,
        NURFC=C.cb_rfc,
        NCURP=C.cb_curp,
        ENAME=C.prettyname,
        BTEXT=RS.RS_CIUDAD,
        ZMORGTX05=N2.TB_ELEMENT,
        AREA=N3.TB_ELEMENT,
        SUBAERA=N4.TB_ELEMENT,
        PTEXT=E1.TB_ELEMENT,
        PHOTO64=IM_BLOB
      from COLABORA C
      Left Join RPATRON RP on C.CB_PATRON=RP.TB_CODIGO
      Left Join RSOCIAL RS on RP.RS_CODIGO=RS.RS_CODIGO
      Left Join NIVEL2 N2 on C.CB_NIVEL2=N2.TB_CODIGO
	    Left Join NIVEL3 N3 on C.CB_NIVEL3=N3.TB_CODIGO
      Left Join NIVEL4 N4 on C.CB_NIVEL4=N4.TB_CODIGO
      Left Join EXTRA1 E1 on C.CB_G_TAB_1=E1.TB_CODIGO
      Left Join IMAGEN I on C.CB_CODIGO=I.CB_CODIGO and I.IM_TIPO = 'FOTO'
      where C.CB_ACTIVO='S'
      `, {
        logging: () => console.log(chalk.green('Successful query to employees'))
      });

      const employees = result[0];

      for (let i = 0; i < employees.length; i++) {
        let photo = encode(employees[i].PHOTO64);
        employees[i].PHOTO64 = photo === "" ? null : photo;
      }

      return res.send({
        CCODE: config.companyCode,
        ACTIVEEMPLOYEEList: employees,
        IF_RESULT: "S",
        IF_MESSAGE: ""
      });

    } catch (error) {

      console.error(error);

      return res.send({
        CCODE: config.companyCode,
        ACTIVEEMPLOYEEList: [],
        IF_RESULT: "E",
        IF_MESSAGE: "The request did not return information."
      });
      
    }
  },
  getAllPhotos: async (req, res) => {

    try {

      const Employee = require('../models/employee.model');
      const Photo = require('../models/photo.model');

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
        },
        logging: () => console.log(chalk.green("Successful query to photos"))
      });

      for (const photo of photos) {
        let employeesObject = {};
        employeesObject.CCODE = config.companyCode;
        employeesObject.EMPLOYEEID = photo.getDataValue('CB_CODIGO');
        employeesObject.PHOTO = encode(photo.getDataValue('IM_BLOB'));
        employeesPhotos.push(employeesObject);
      }

      return res.send(employeesPhotos);

    } catch (error) {

      return res.send({
        message: "No information was found with the specified parameters",
        data: []
      });
      
    }

  }
};

module.exports = controller;