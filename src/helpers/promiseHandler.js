const path = require('path')

const promiseHandler = {
  pdfGenerator: (element, pathDestiny) => {
    console.log("ENTRE!!!!");
    const pdf = require('html-pdf');
    const base64 = require('base64topdf');
    return new Promise((resolve, reject) => {
      console.log("ANTES DE CREAR: ", pathDestiny);
      pdf.create(element,
        {
          phantomPath: path.resolve(process.cwd(),"node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs.exe"), 
          phantomArgs: [path.resolve(process.cwd(),"node_modules/html-pdf/lib/scripts/pdf_a4_portrait.js")]
        }).toFile(pathDestiny, 
          function (err, res) {
            if (err){
              console.log("ANTES DEL ERROR: ", pathDestiny);
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