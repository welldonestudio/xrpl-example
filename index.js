const dotEnv = require("dotenv");
const websocket = require("./websocket");
const http = require("./http");

dotEnv.config();

const main = () => {
  //   websocket();
  http();
};

main();
