/** @format */

const commentsService = require("../BL/comments.service.js");
const express = require("express"),
  router = express.Router();

router.get("/", async (req, res) => {
  try {
    const postId = req.query.postId;
    res.send(await commentsService.getComments({ postId}));
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/add-comment", async (req, res) => {
  try {
    const { postId, name, email, body } = req.body;
    res.send(
      await commentsService.createNewComment({ postId, name, email, body })
    );
  } catch (error) {
    res.status(400).send(error.message || "Error creating comment");
  }
});
router.put("/update-comment/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { body, email, name } = req.body;
    res.send(await commentsService.updateComment({ id, email, name, body }));
  } catch (error) {
    res.status(400).send(error.message || "Error updating post");
  }
});

router.delete("/delete-comment/:id", async (req, res) => {
  try {
    const commentId = req.params.id;
    res.send(await commentsService.deleteComment({ id: commentId }));
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = router;
