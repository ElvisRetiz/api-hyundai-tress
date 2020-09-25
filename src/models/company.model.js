const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

class Company extends Model {}

Company.init({
  RS_CODIGO: {
    type: DataTypes.CHAR,
    allowNull: false,
    primaryKey: true
  },
  RS_NOMBRE: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  RS_CALLE: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  RS_NUMEXT: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  RS_COLONIA: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  RS_CIUDAD: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  RS_RFC: {
    type: DataTypes.CHAR,
    allowNull: false
  }
},{
  sequelize,
  modelName: 'Company',
  tableName: 'RSOCIAL',
  timestamps: false
});

module.exports = Company;