const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

class Concepts extends Model {}

Concepts.init({
  CO_NUMERO: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  CO_DESCRIP: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  CO_IMPRIME: {
    type: DataTypes.CHAR,
    allowNull: false
  }
},{
  sequelize,
  modelName: 'Concepts',
  tableName: 'CONCEPTO',
  timestamps: false
});

module.exports = Concepts;