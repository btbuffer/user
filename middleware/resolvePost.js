const { mongoose } = require("mongoose");
const Post = require("../models/post.model");

const resolvePostById = async (request, response, next) => {
  const {
    params: { postId },
  } = request;

  // Check for valid Post ID and respond with
  // 400 status code for invalid or not suitable ID
  const isValid =
    mongoose.Types.ObjectId.isValid(postId) &&
    String(new mongoose.Types.ObjectId(postId)) === postId;
  if (!isValid) return response.status(400).send({ msg: "Invalid post ID" });

  const foundPost = await Post.findById(postId).populate("creator");
  // console.log("Resolve POST: ", foundPost, typeof foundPost);

  // Check if the post exist, otherwise respond with 404 status
  // code: resource is not found.
  if (!foundPost) {
    return response.status(404).send({ message: "Post not found" });
  }

  request.post = { postId, foundPost };

  next();
};

module.exports = resolvePostById;
