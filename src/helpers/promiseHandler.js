const promiseHandler = {
  pdfGenerator: (element, pathDestiny) => {
    const pdf = require('html-pdf');
    const base64 = require('base64topdf');
    return new Promise((resolve, reject) => {
      pdf.create(element).toFile(pathDestiny, function (err, res) {
        if (err){
          console.log(err);
          reject(err)
        } else {
          console.log(res);
          let pdfBase64 = base64.base64Encode(pathDestiny)
          resolve(pdfBase64)
        }
      });
    });
  }
};

module.exports = promiseHandler;