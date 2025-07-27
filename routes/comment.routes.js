const { Router } = require("express");
const {
  createComment,
  fetchComments,
  deleteComment,
} = require("../controller/comment.controller");
const authenticateUser = require("../middleware/auth");

const router = Router();
router.post("/api/comment", authenticateUser, createComment);
router.get("/api/comments", fetchComments);
router.delete("/api/comments/:commentId", authenticateUser, deleteComment);

module.exports = router;
