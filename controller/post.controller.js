const { mongoose } = require("mongoose");
const Post = require("../models/post.model");

// Create a post after a successful login
const createPost = async (request, response) => {
  if (!request.user) {
    return response
      .status(401)
      .send({ msg: "Please, login to create a post." });
  }

  const {
    user: { userId },
    body,
  } = request;

  const post = new Post({ ...body, creatorId: userId });
  await post.save();
  return response.json({ postId: post.id });
};

const fetchPost = async (request, response) => {
  if (!request.user) {
    // is this condition necessary for fetchPost: || request.user.userId !== foundPost.creatorId
    return response.status(401).send({ msg: "Unauthorized! Please, login" });
  }

  const {
    params: { postId },
  } = request;

  const isValid =
    mongoose.Types.ObjectId.isValid(postId) &&
    postId === String(new mongoose.Types.ObjectId(postId));

  if (!isValid) {
    return response.status(400).send({ msg: "Invalid post ID" });
  }

  const foundPost = await Post.findById(postId);

  if (!foundPost) return response.status(404).send({ msg: "Post not found" });

  return response.status(200).send(foundPost);
};

// Update a post
const updatePost = async (request, response) => {
  const {
    params: { postId },
    body,
    user,
  } = request;

  // Check for valid Post ID and respond with
  // 400 status code for invalid or not suitable ID
  const isValid =
    mongoose.Types.ObjectId.isValid(postId) &&
    String(new mongoose.Types.ObjectId(postId)) === postId;
  if (!isValid) return response.status(400).send({ msg: "Invalid post ID" });

  // Check if a user is authenticated to perform this action.
  // Otherwise, respond with 401 status code: unauthorized,
  // i.e., client not authenticated.
  if (!user) {
    return response.status(401).send({ msg: "Authentication required." });
  }

  // Allow Post update only if the post's author is the one
  // making the changes. Otherwise, respond with 403 status
  // code: performed action is forbidden.
  const foundPost = await Post.findById(postId);
  if (user.userId !== foundPost.creatorId.toString())
    return response
      .status(403)
      .send({ msg: "You do not have permission to perform this action." });

  // Check if the post exist, otherwise respond with 404 status
  // code: resource is not found.
  if (!foundPost) {
    return response.status(404).send({ message: "Post not found" });
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, body, { new: true });

  return response.status(200).json(updatedPost);
};

// Delete a post only if a user is the
// author of the post.
const deletePost = async (request, response) => {
  const {
    params: { postId },
    user,
  } = request;

  const isValid =
    mongoose.Types.ObjectId.isValid(postId) &&
    String(new mongoose.Types.ObjectId(postId)) === postId;
  if (!isValid) return response.status(400).send({ msg: "Invalid post ID" });

  if (!user)
    return response.status(401).send({ msg: "Authentication required" });

  // Don't allow post deletion if a user is not the author
  // and/or not the admin. And respond with 403 status
  // code: performed action is forbidden, i.e.,

  // isOwner AND notAdmin === false && true = Have permission
  // notOwner AND notAdmin === true && true = Do not have permission
  // notOwner AND isAdmin === true && false = Have permission
  // isOwner AND isAdmin === false && false = Havve permission
  const foundPost = await Post.findById(postId);
  if (user.userId !== foundPost.creatorId.toString() && !foundPost.isAdmin)
    return response
      .status(403)
      .send({ msg: "You do not have permission to perform this action." });

  if (!foundPost) return response.status(404).send({ msg: "Post not found" });

  // Verify the ownership of the post and ensure
  // the author of the post is one deleting a post.
  await Post.findByIdAndDelete(postId);
  return response.status(200).send({ msg: "post successfully deleted!" });
};

module.exports = { createPost, fetchPost, updatePost, deletePost };
