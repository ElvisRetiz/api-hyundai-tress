const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/index');

class Period extends Model {}

Period.init({
  PE_YEAR: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  PE_NUMERO: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  PE_TIPO: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  PE_FEC_PAG: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  PE_MES: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  CB_CODIGO: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  }
},{
  sequelize,
  modelName: 'Period',
  tableName: 'NOMINA',
  timestamps: false
});

module.exports = Payroll;