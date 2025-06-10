const express = require("express"),
  router = express.Router();
const postsService = require("../BL/posts.service");
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const postId = req.query.id;
    if (postId) {
      const post = await postsService.getPostById({ userId, postId });
      return res.send(post);
    }
    const posts = await postsService.getPosts({
      userId,
      title: req.query.title,
    });
    res.send(posts);
  } catch (error) {
    res.status(400).send(error.message || "Error fetching posts");
  }
});
router.post("/add-post", async (req, res) => {
  try {
    const { userId, title, body } = req.body;
    res.send(await postsService.createNewPost({ userId, title, body }));
  } catch (error) {
    res.status(400).send(error.message || "Error creating post");
  }
});
router.put("/update-post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, title, body } = req.body;
    res.send(await postsService.updatePost({ id, userId, title, body }));    
  } catch (error) {
    res.status(400).send(error.message || "Error updating post");
  }
});
router.delete("/delete-post/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    res.send(await postsService.deletePost({ id: postId }));
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
