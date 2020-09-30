const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const { dbUser, dbPassword, dbServer, dbName } = JSON.parse(fs.readFileSync(path.join(__dirname,'../../','config.json'))).dbConfig;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbServer,
  dialect: 'mssql'
});

module.exports = sequelize;