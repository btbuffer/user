const { Router } = require("express");
const authenticateUser = require("../middleware/auth");
const resolvePostById = require("../middleware/resolvePost");

const {
  createPost,
  fetchPost,
  deletePost,
  updatePost,
} = require("../controller/post.controller");

const router = Router();

router.post("/api/posts", authenticateUser, createPost);
router.get("/api/posts/:postId", fetchPost);
router.put("/api/posts/:postId", authenticateUser, resolvePostById, updatePost);
router.delete(
  "/api/posts/:postId",
  authenticateUser,
  resolvePostById,
  deletePost
);

module.exports = router;
