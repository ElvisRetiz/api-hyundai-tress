const fs = require('fs');
const path = require('path');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const { arrayToObject } = require('../helpers/configObjectHandler');

let configArray = fs.readFileSync(path.join(__dirname,'../../','config/data.config')).toString().split(',');
const config = arrayToObject(configArray);

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