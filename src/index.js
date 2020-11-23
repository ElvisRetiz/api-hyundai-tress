console.log('Starting...');

const os = require("os");
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const app = require("./app");
const { stringToObject } = require("./helpers/configObjectHandler");
 
console.log(chalk.white('Validating environment...'));

let configString = fs.readFileSync(path.resolve(process.cwd(),'config/app.config')).toString();
let port = stringToObject(configString).appPort;

async function main () {

  try {

    let mykey = crypto.createHmac('sha256','kitsacv');
    mykey.update(`${os.platform()}${os.hostname()}${os.cpus()[0].mode}`,'utf8','hex');
    let mystr = mykey.digest('hex');

    let appkey = fs.readFileSync(path.resolve(process.cwd(),'app.key')).toString();

    if(!(mystr === appkey)) throw new Error('Unauthorized server');

    app.listen(port);
    console.log(chalk.greenBright(`APIRest running on http://localhost:${port}/api/`));

  } catch (error) {

    console.error(chalk.redBright(error));

  }

}

main();