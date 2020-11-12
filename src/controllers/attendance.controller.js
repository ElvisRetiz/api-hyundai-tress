const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const chalk = require('chalk');

const Day = require('../models/day.model');
const Record = require('../models/record.model');
const Incidence = require('../models/incidence.model');

const { arrayToObject } = require('../helpers/configObjectHandler');

let configArray = fs.readFileSync(path.resolve(process.cwd(),'config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

const controller = {
  getAttendanceByMonth: async (req, res) => {
    try {
      const { year, month, employee } = req.params;
      const attendance = [];

      let days = await Day.findAll({
        where:{
          CB_CODIGO: parseInt(employee, 10),
          AU_FECHA: Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('AU_FECHA')),parseInt(month, 10)),
          $and: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('AU_FECHA')),parseInt(year, 10))
        },
        logging: () => console.log(chalk.green("Successful query to day"))
      });

      if (days.length === 0) {
        return res.send({
          ATTENDANCEList: [],
          IF_RESULT: "E",
          IF_MESSAGE: "No information was found with the specified parameters."
        })
      };

      let records = await Record.findAll({
        where:{
          CB_CODIGO: parseInt(employee, 10),
          AU_FECHA: Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('AU_FECHA')),parseInt(month, 10)),
          $and: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('AU_FECHA')),parseInt(year, 10))
        },
        logging: () => console.log(chalk.green("Successful query to record"))
      });

      if (records.length === 0) {
        return res.send({
          ATTENDANCEList: [],
          IF_RESULT: "E",
          IF_MESSAGE: "No information was found with the specified parameters."
        })
      };

      let incidences = await Incidence.findAll({
        logging: () => console.log(chalk.green("Successful query to incidence"))
      });

      for (const day of days) {

        let dayObject = {};

        dayObject.CCODE = config.companyCode;
        dayObject.PERNR = `${employee}`;

        //remove if is necesary
        let date = new Date(day.getDataValue('AU_FECHA'))
        date.setDate(date.getDate() +1 )

        dayObject.DATE = dayjs(date).format("DD/MM/YYYY");
        
        for (const record of records) {
          if (dayjs(day.getDataValue('AU_FECHA')).format() === dayjs(record.getDataValue('AU_FECHA')).format()) {
            if (record.getDataValue('CH_TIPO') === 1) {
              dayObject.CHECKIN =  record.getDataValue('CH_H_REAL');
            } else {
              dayObject.CHECKOUT = record.getDataValue('CH_H_REAL');
            }
          }
        }
        
        if (!dayObject.hasOwnProperty('CHECKIN')) dayObject.CHECKIN = ""

        if (!dayObject.hasOwnProperty('CHECKOUT')) dayObject.CHECKOUT = ""

        if (day.getDataValue('AU_TIPO') !== "   ") {
          let incidence = incidences.filter(inc => inc.getDataValue('TB_CODIGO') === (day.getDataValue('AU_TIPO') === "VAC" ? "V  " : day.getDataValue('AU_TIPO')));
          dayObject.DESCRIPTION = incidence[0].TB_ELEMENT;
          dayObject.DESCRIPTIONEN = incidence[0].TB_INGLES;
        }else {
          dayObject.DESCRIPTION = 'Ordinaria';
          dayObject.DESCRIPTIONEN = 'Ordinary';
        }

        attendance.push(dayObject)

      }

      return res.send({
        ATTENDANCEList: attendance,
        IF_RESULT: "S",
        IF_MESSAGE: ""
      });

    } catch (error) {

      console.error(error);

      return res.send({
        ATTENDANCEList: [],
        IF_RESULT: "E",
        IF_MESSAGE: "No information was found with the specified parameters."
      });
      
    }
  }
};

module.exports = controller;