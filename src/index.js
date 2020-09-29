console.log('Starting...');

const os = require("os");
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const app = require("./app");

require('dotenv').config();

console.log(chalk.white('Validating environment...'));

const port = process.env.APP_PORT || 8090

async function main () {

  try {

    let mykey = crypto.createHmac('sha256','kitsacv');
    mykey.update(`${os.platform()}${os.hostname()}${os.cpus()[0].mode}`,'utf8','hex');
    let mystr = mykey.digest('hex');

    let appkey = fs.readFileSync(path.join(__dirname,'../','app.key')).toString();

    if(!(mystr === appkey)) throw new Error('Unauthorized server');

    app.listen(port);
    console.log(chalk.greenBright(`APIRest running on http://localhost:${port}/api/`));
    console.log(chalk.greenBright(`APIRest running on http://${os.networkInterfaces().Ethernet[os.networkInterfaces().Ethernet.length-1].address}:${port}/api/`));

  } catch (error) {

    console.error(chalk.redBright(error));

  }

}

main();