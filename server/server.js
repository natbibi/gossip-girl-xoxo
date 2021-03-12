const express = require("express");
const server = express();
const bodyParser = require("body-parser");
var cors = require('cors')

server.use(bodyParser.json());
server.use(cors())

server.get("/", (req, res) => {
  res.send("welcome to gossip girl");
});

module.exports = server;

