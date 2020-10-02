const fs = require('fs');
const path = require('path');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const { arrayToObject } = require('../helpers/configObjectHandler');

let configArray = fs.readFileSync(path.join(__dirname,'../../','config/data.config')).toString().split(',');
const { costCenter } = arrayToObject(configArray);

class Payroll extends Model {}

Payroll.init({
  NO_PERCEPC: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  NO_DEDUCCI: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  NO_NETO: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  NO_TIMBRO: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  PE_YEAR: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  PE_NUMERO: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  PE_TIPO: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  CB_SALARIO: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  CB_SAL_INT: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  [`CB_${costCenter}`]: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CB_CODIGO: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  }
},{
  sequelize,
  modelName: 'Payroll',
  tableName: 'NOMINA',
  timestamps: false
});

module.exports = Payroll;