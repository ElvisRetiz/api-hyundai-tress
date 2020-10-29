const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const chalk = require('chalk');

const Day = require('../models/day.model');
const Record = require('../models/record.model');
const Incidence = require('../models/incidence.model');

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
          message: "No information was found with the specified parameters",
          data: []
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
          message: "No information was found with the specified parameters",
          data: []
        })
      };

      let incidences = await Incidence.findAll({
        logging: () => console.log(chalk.green("Successful query to incidence"))
      });

      for (const day of days) {

        let dayObject = {};

        //remove if is necesary
        let date = new Date(day.getDataValue('AU_FECHA'))
        date.setDate(date.getDate() +1 )

        dayObject.date = dayjs(date).format("DD/MM/YYYY");
        
        for (const record of records) {
          if (dayjs(day.getDataValue('AU_FECHA')).format() === dayjs(record.getDataValue('AU_FECHA')).format()) {
            if (record.getDataValue('CH_TIPO') === 1) {
              dayObject.checkin =  record.getDataValue('CH_H_REAL');
            } else {
              dayObject.checkout = record.getDataValue('CH_H_REAL');
            }
          }
        }
        
        if (!dayObject.hasOwnProperty('checkin')) dayObject.checkin = ""

        if (!dayObject.hasOwnProperty('checkout')) dayObject.checkout = ""

        if (day.getDataValue('AU_TIPO') !== "   ") {
          let incidence = incidences.filter(inc => inc.getDataValue('TB_CODIGO') === day.getDataValue('AU_TIPO'));
          dayObject.description = incidence[0].TB_ELEMENT;
          dayObject.descriptionEN = incidence[0].TB_INGLES;
        }else {
          dayObject.description = 'Ordinaria';
          dayObject.descriptionEN = 'Ordinary';
        }

        attendance.push(dayObject)

      }

      return res.send({
        message: "Succes.",
        data: attendance
      });

    } catch (error) {

      console.error(error);

      return res.send({
        message: "No information was found with the specified parameters",
        data: []
      });
      
    }
  }
};

module.exports = controller;