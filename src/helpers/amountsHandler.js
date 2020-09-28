const amountsHandler = {
  format: (amount) => {
    let formattedAmount = new Intl.NumberFormat("en-IN",{style: "currency", currency: "MXN"}).format(Math.abs(amount)).slice(2);
    return formattedAmount;
  }
};

module.exports = amountsHandler;