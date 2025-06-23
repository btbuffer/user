const { Router } = require("express");
const verifyUser = require("../middleware/auth");

const {
  createPost,
  fetchPost,
  deletePost,
  updatePost,
} = require("../controller/post.controller");

const router = Router();

router.post("/api/posts", verifyUser, createPost);
router.get("/api/posts/:postId", verifyUser, fetchPost);
router.put("/api/posts/:postId", verifyUser, updatePost);
router.delete("/api/posts/:postId", deletePost);

module.exports = router;
