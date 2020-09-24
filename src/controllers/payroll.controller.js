const dayjs = require('dayjs');
const Sequelize = require('sequelize');

const controller = {
  getPayrollByMonth: async (req, res) => {
    try {
      
      const { year, month, employee } = req.params;

    } catch (error) {

      console.error(error);

      return res.send({
        message: "Something goes wrong!"
      })
      
    }
  }
};

module.exports = controller;