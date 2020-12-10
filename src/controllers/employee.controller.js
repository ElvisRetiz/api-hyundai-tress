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
        ZMORGTX05=N3.TB_ELEMENT,
        AREA=N3.TB_ELEMENT,
        SUBAERA=PU.PU_DESCRIP,
        PTEXT=N7.TB_ELEMENT,
        PHOTO64=(select IM_BLOB as '*' from IMAGEN where CB_CODIGO = C.CB_CODIGO and IM_TIPO = 'FOTO' for xml path(''))
      from COLABORA C
      Left Join RPATRON RP on C.CB_PATRON=RP.TB_CODIGO
      Left Join RSOCIAL RS on RP.RS_CODIGO=RS.RS_CODIGO
      Left Join NIVEL3 N3 on C.CB_NIVEL3=N3.TB_CODIGO
      Left Join PUESTO PU on C.CB_PUESTO=PU.PU_CODIGO
      Left Join NIVEL7 N7 on C.CB_NIVEL7=N7.TB_CODIGO
      where C.CB_ACTIVO='S'
      `, {
        logging: () => console.log(chalk.green('Successful query to employees'))
      });

      let employees = result[0];

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

      const { employee } = req.params;

      const result = await sequelize.query(`
        select 
          PERNR=CAST(CB_CODIGO AS varchar),
          PHOTO64=(select IM_BLOB as '*' from IMAGEN where CB_CODIGO = COLABORA.CB_CODIGO and IM_TIPO = 'FOTO' for xml path(''))
          from COLABORA
        where CB_CODIGO = ${parseInt(employee)}
      `,{
        logging: () => console.log(chalk.green('Successful query to photos'))
      });

      const photos = result[0];

      photos.forEach(photo => {
        photo.CCODE = config.companyCode;
      });

      return res.send(photos);

    } catch (error) {

      return res.send({
        message: "No information was found with the specified parameters",
        data: []
      });
      
    }

  }
};

module.exports = controller;