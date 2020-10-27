const fs = require('fs');
const path = require('path');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db.comparte');

const { arrayToObject } = require('../helpers/configObjectHandler');

let configArray = fs.readFileSync(path.join(__dirname,'../../','config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

class Type extends Model {}

Type.init({
  TB_CODIGO: {
    type: DataTypes.CHAR,
    allowNull: false,
    primaryKey: true
  },
  TB_ELEMENT: {
    type: DataTypes.CHAR,
    allowNull: false
  }
},{
  sequelize,
  modelName: 'Type',
  tableName: `${config.employeeType}`,
  timestamps: false
});

module.exports = Type;