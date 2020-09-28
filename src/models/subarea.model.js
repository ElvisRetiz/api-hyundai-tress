const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const config = require('../../config');

class Subarea extends Model {}

Subarea.init({
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
  modelName: 'Subarea',
  tableName: `${config.subarea}`,
  timestamps: false
});

module.exports = Subarea;