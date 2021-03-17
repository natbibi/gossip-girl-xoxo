const express = require("express");
const router = express.Router();

const Post = require("../models/post");
const helperFuncs = require("../helpers.js")

router.get("/", (req, res) => {
  const postData = Post.all;
  res.send(postData);
});

//pagination for new
router.get("/:from/:to", (req, res) => {
  const from = req.params.from
  const to = req.params.to
  const postData = Post.all;
  const sliceData = postData.slice(from, to)
  res.send(sliceData);
});

router.get("/hot", (req, res) => {
  const postData = Post.all;
  const sortedData = postData.sort((a,b) => helperFuncs.compare(a, b))
  res.send(sortedData);
});

// pagination for hot
router.get("/hot/:from/:to", (req, res) => {
  const from = req.params.from
  const to = req.params.to
  const postData = Post.all;
  const sortedData = postData.sort((a,b) => helperFuncs.compare(a, b))
  const sliceData = sortedData.slice(from, to)
  res.send(sliceData);
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
