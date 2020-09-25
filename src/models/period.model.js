const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

class Period extends Model {}

Period.init({
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
  PE_FEC_PAG: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true
  },
  PE_FEC_INI: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  PE_FEC_FIN: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true
  },
  PE_MES: {
    type: DataTypes.SMALLINT,
    allowNull: false
  }
},{
  sequelize,
  modelName: 'Period',
  tableName: 'PERIODO',
  timestamps: false
});

module.exports = Period;