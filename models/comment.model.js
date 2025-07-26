const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    // Child schema
    commenter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    post: {
      // Parent schema
      // many instances of Comment belong to one instance of Post
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
