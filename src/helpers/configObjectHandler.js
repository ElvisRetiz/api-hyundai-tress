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
  }
};

module.exports = configObjectHandler;