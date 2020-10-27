const fs = require('fs');
const path = require('path');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const { arrayToObject } = require('../helpers/configObjectHandler');

let configArray = fs.readFileSync(path.resolve(process.cwd(),'config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

class Subarea extends Model {}

Subarea.init({
  PU_CODIGO: {
    type: DataTypes.CHAR,
    allowNull: false,
    primaryKey: true
  },
  PU_DESCRIP: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  PU_INGLES: {
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