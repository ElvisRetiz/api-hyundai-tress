const fs = require('fs');
const path = require('path');

const sequelize = require('../db/index');

const controller = {
  getAllRoutes: async (req, res) => {
    const htmlDocument = fs.readFileSync(path.resolve(process.cwd(),'assets/html/index.html'), { encoding: 'utf-8'});
    res.send(htmlDocument);
  },
  tasteDB: async (req, res) => {
    try {

      await sequelize.authenticate();
      res.send({type: "succes"});

    } catch (error) {

      console.log(err);
      res.send({type: "fail"});
      
    }
  }
};

module.exports = controller;