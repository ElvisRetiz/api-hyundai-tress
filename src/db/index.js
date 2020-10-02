const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const { arrayToObject } = require('../helpers/configObjectHandler');

let configArray = fs.readFileSync(path.join(__dirname,'../../','/config/','db.config')).toString().split(',');
let { dbUser, dbPassword, dbServer, dbName } = arrayToObject(configArray);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbServer,
  dialect: 'mssql'
});

module.exports = sequelize;