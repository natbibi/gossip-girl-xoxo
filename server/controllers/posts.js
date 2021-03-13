const express = require("express");
const router = express.Router();

const Comment = require("../models/comment");
const Post = require("../models/post");


router.get("/", (req, res) => {
  const postData = Post.all;
  res.send(postData);
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const postToSend = Post.findById(id);
    res.send(postToSend);
  });


module.exports = router;
