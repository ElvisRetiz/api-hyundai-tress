const fs = require('fs');
const path = require('path');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const config = JSON.parse(fs.readFileSync(path.join(__dirname,'../../','config.json'))).dataConfig;

class Area extends Model {}

Area.init({
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
  modelName: 'Area',
  tableName: `${config.area}`,
  timestamps: false
});

module.exports = Area;