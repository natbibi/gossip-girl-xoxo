const data = require('./data.json')

const express = require("express");
const server = express();
const bodyParser = require("body-parser");
var cors = require('cors')

server.use(bodyParser.json());
server.use(cors())

server.get("/", (req, res) => {
  res.send("welcome to gossip girl");
});

const postRoutes = require("./controllers/posts");
server.use("/posts", postRoutes);

module.exports = server;

