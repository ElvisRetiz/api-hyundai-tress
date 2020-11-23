const configObjectHandler = {
  arrayToObject: (array) => {
    let object = {};
    array.forEach( element  => {
      object[element.split(':')[0]] = element.split(':')[1]; 
    });
    return object;
  },
  stringToObject: (string) => {
    let object = {};
    object[string.split(':')[0]] = string.split(':')[1];
    return object;
  },
  setAndDeleteProperty: (object, nameActualProp, nameNewProp) => {
    object.setDataValue(nameNewProp, object.getDataValue(nameActualProp));
    delete object.dataValues[nameActualProp]
  },
  setAndDeleteDateProperty: (object, nameActualProp, nameNewProp) => {
    const dayjs = require('dayjs');
    const { addDay } = require('../helpers/dateHandler');

    object.setDataValue(nameNewProp, dayjs(addDay(object.getDataValue(nameActualProp))).format('DD/MM/YYYY'));
    delete object.dataValues[nameActualProp]
  },
  setAndDeletePropertyWithNewValue: (object, nameActualProp, nameNewProp, newProp) => {
    object.setDataValue(nameNewProp,newProp);
    delete object.dataValues[nameActualProp]
  }
};

module.exports = configObjectHandler;