const { mongoose } = require("mongoose");
const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

// Make comment
const createComment = async (request, response) => {
  const {
    user: { userId },
    params: { postId },
    body,
  } = request;

  const comment = new Comment({ commenter: userId, ...body });
  await comment.save();

  await Post.findByIdAndUpdate(postId, { $push: { comments: comment.id } });

  return response.status(201).send({ comment: comment.id });
};

// Get all commment
const fetchComments = async (request, response) => {
  const comments = await Comment.find();
  response.status(200).send({ comments });
};

// Delete comment
const deleteComment = async (request, response) => {
  const {
    params: { commentId },
    user,
  } = request;

  const isValid =
    mongoose.Types.ObjectId.isValid(commentId) &&
    String(new mongoose.Types.ObjectId(commentId)) === commentId;

  if (!isValid) return response.status(400).send({ msg: "Invalid comment ID" });

  const foundComment = await Comment.findById(commentId);
  if (!foundComment)
    return response.status(404).send({ msg: "Comment not found" });

  if (user.userId !== foundComment.commenter && !user.isAdmin)
    return response
      .status(403)
      .send({ msg: "You do not have permission to perform this action" });

  await Comment.findByIdAndDelete(commentId);
  return response.status(204);
};

module.exports = { createComment, fetchComments, deleteComment };
