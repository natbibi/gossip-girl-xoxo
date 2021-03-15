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

  router.post("/", (req, res) => {
    const newPost = Post.create(req.body);
    res.send(newPost);
  });

  router.patch("/:id/comments", (req, res) => {
    const id = parseInt(req.params.id)
    const postToUpdate = Post.findById(id);
    postToUpdate.addComment(req.body)
    res.sendStatus(204);
  });

  router.patch("/:id/reactions", (req, res) => {
    const id = parseInt(req.params.id)
    const postToUpdate = Post.findById(id);
    postToUpdate.addReaction(req.body.reaction)
    res.sendStatus(204);
  });


module.exports = router;
