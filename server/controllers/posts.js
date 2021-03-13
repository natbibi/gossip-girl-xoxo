const express = require("express");
const router = express.Router();

const Comment = require("../models/comment");
const Post = require("../models/post");


router.get("/", (req, res) => {
  const pollData = Post.all;
  res.send(pollData);
});


module.exports = router;
