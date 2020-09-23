const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

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
  CB_NIVEL1: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CB_NIVEL2: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CB_NIVEL3: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CB_NIVEL4: {
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