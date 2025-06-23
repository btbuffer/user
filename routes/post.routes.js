const { Router } = require("express");
const verifyUser = require("../middleware/auth");
const resolvePostById = require("../middleware/resolvePost");

const {
  createPost,
  fetchPost,
  deletePost,
  updatePost,
} = require("../controller/post.controller");

const router = Router();

router.post("/api/posts", verifyUser, createPost);
router.get("/api/posts/:postId", fetchPost);
router.put("/api/posts/:postId", verifyUser, resolvePostById, updatePost);
router.delete("/api/posts/:postId", verifyUser, resolvePostById, deletePost);

module.exports = router;
