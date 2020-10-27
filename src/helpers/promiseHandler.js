const path = require('path')

const promiseHandler = {
  pdfGenerator: (element) => {
    const pdf = require('html-pdf');
    const { encode } = require('base64-arraybuffer');
    return new Promise((resolve, reject) => {
      pdf.create(element,
        {
          phantomPath: path.resolve(process.cwd(),"node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs.exe"), 
          phantomArgs: [path.resolve(process.cwd(),"node_modules/html-pdf/lib/scripts/pdf_a4_portrait.js")]
        }).toBuffer( 
          function (err, buffer) {
            if (err){
              console.log(err);
              reject(err)
            } else {
              let pdfBase64 = encode(buffer)
              resolve(pdfBase64)
            }
        });
    });
  }
};

module.exports = promiseHandler;