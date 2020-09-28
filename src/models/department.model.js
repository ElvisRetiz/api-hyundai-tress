const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const config = require('../../config');

class Department extends Model {}

Department.init({
  TB_CODIGO: {
    type: DataTypes.CHAR,
    allowNull: false,
    primaryKey: true
  },
  TB_ELEMENT: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  TB_INGLES: {
    type: DataTypes.CHAR,
    allowNull: false
  }
},{
  sequelize,
  modelName: 'Department',
  tableName: `${config.department}`,
  timestamps: false
});

module.exports = Department;