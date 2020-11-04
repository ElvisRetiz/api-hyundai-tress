const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const { arrayToObject } = require('../helpers/configObjectHandler');

let configArray = fs.readFileSync(path.resolve(process.cwd(),'config/db.config')).toString().split(',');
let { dbUser, dbPassword, dbServer, dbName } = arrayToObject(configArray);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbServer,
  dialect: 'mssql',
  dialectOptions: {
    options: {encrypt: false}
  }
});

module.exports = sequelize;