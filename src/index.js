const app = require("./app");

require('dotenv').config();

const port = process.env.APP_PORT || 8090

async function main () {

  try {
    app.listen(port);
    console.log(`API Rest running on http://localhost:${port}`);
  } catch (error) {
    console.error(error)
  }

}

main();