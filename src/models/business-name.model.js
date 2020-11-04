const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

class BusinessName extends Model {}

BusinessName.init({
  RS_CODIGO: {
    type: DataTypes.CHAR,
    allowNull: false,
    primaryKey: true
  },
  TB_CODIGO: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  TB_NUMREG: {
    type: DataTypes.CHAR,
    allowNull: false
  }
},{
  sequelize,
  modelName: 'BusinessName',
  tableName: 'RPATRON',
  timestamps: false
});

module.exports = BusinessName;