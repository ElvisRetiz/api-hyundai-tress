const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

class Photo extends Model {}

Photo.init({
  CB_CODIGO: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  IM_TIPO: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  IM_BLOB: {
    type: DataTypes.BLOB,
    allowNull: false
  }
},{
  sequelize,
  modelName: 'Photo',
  tableName: 'IMAGEN',
  timestamps: false
});

module.exports = Photo;