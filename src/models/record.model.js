const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');
const Day = require('./day.model');

class Record extends Model {}

Record.init({
  AU_FECHA: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true
  },
  CH_H_REAL: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CH_TIPO: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CB_CODIGO: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},{
  sequelize,
  modelName: 'Record',
  tableName: 'CHECADAS',
  timestamps: false
});

module.exports = Record;