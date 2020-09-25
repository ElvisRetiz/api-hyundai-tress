const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const config = require('../config');

class CostCenter extends Model {}

CostCenter.init({
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
  modelName: 'CostCenter',
  tableName: `${config.costCenter}`,
  timestamps: false
});

module.exports = CostCenter;