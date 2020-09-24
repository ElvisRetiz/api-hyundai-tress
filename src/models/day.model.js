const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');
const Record = require('./record.model');

class Day extends Model {}

Day.init({
  AU_FECHA: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  AU_TIPO: {
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
  modelName: 'Day',
  tableName: 'AUSENCIA',
  timestamps: false
});

module.exports = Day;