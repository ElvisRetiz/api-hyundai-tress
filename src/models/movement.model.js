const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

class Movement extends Model {}

Movement.init({
  CO_NUMERO: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  MO_PERCEPC: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  MO_DEDUCCI: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  PE_TIPO: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  PE_NUMERO: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CB_CODIGO: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},{
  sequelize,
  modelName: 'Movement',
  tableName: 'MOVIMIEN',
  timestamps: false
});

module.exports = Movement;