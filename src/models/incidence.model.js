const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

class Incidence extends Model {}

Incidence.init({
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
  modelName: 'Incidence',
  tableName: 'INCIDEN',
  timestamps: false
});

module.exports = Incidence;