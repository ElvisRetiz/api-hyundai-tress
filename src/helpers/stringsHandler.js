const stringsHandler = {
  format: (element) => {
    let arrayElement = element
                      .split(',')
                      .map(element => element.split(' '))
                      .reverse()
                      .flat();
    let newElement = '';
    arrayElement.forEach(element => {
      newElement += `${element} `
    });
    let name = newElement.trim();
    return name;
  }
};

module.exports = stringsHandler;