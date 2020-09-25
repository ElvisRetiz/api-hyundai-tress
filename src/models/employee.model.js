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