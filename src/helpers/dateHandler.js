const dateHandler = {
  addDay: (date) => {
    let newDate = new Date(date);
    return newDate.setDate(newDate.getDate()+1)
  }
};

module.exports = dateHandler;