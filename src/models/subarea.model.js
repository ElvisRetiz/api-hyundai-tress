const fs = require('fs');
const path = require('path');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const config = JSON.parse(fs.readFileSync(path.join(__dirname,'../../','config.json'))).dataConfig;

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