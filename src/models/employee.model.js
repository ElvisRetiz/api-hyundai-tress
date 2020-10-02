const fs = require('fs');
const path = require('path');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const { arrayToObject } = require('../helpers/configObjectHandler');

let configArray = fs.readFileSync(path.join(__dirname,'../../','config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

class Employee extends Model {}

Employee.init({
  CB_CODIGO: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  CB_ACTIVO: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  PRETTYNAME: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  [`CB_${config.department}`]: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  [`CB_${config.area}`]: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  [`CB_${config.subarea}`]: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  [`CB_${config.employeeType}`]: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CB_PATRON: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CB_FEC_ANT: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  CB_FEC_ING: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  CB_SEGSOC: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CB_RFC: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CB_CURP: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CB_INFCRED: {
    type: DataTypes.CHAR,
    allowNull: false
  }
},{
  sequelize,
  modelName: 'Employee',
  tableName: 'COLABORA',
  timestamps: false
});

module.exports = Employee;