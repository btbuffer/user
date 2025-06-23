const { mongoose } = require("mongoose");
const Post = require("../models/post.model");

// Create a post
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

// Retrieve a post
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
  const { user, post, body } = request;
  // Allow Post update only if the post's author is the one
  // making the changes. Otherwise, respond with 403 status
  // code: performed action is forbidden.
  if (user.userId !== post.creatorId.toString())
    return response
      .status(403)
      .send({ msg: "You do not have permission to perform this action." });

  const updatedPost = await Post.findByIdAndUpdate(post.postId, body, {
    new: true,
  });

  return response.status(200).json(updatedPost);
};

// Delete a post.
const deletePost = async (request, response) => {
  const { post, user } = request;

  // Don't allow post deletion if a user is not the author
  // and/or not the admin. And respond with 403 status
  // code: performed action is forbidden, i.e.,

  // isOwner AND notAdmin === false && true = Have permission
  // notOwner AND notAdmin === true && true = Do not have permission
  // notOwner AND isAdmin === true && false = Have permission
  // isOwner AND isAdmin === false && false = Havve permission
  if (user.userId !== post.creatorId.toString() && !user.isAdmin)
    return response
      .status(403)
      .send({ msg: "You do not have permission to perform this action." });

  await Post.findByIdAndDelete(post.postId);
  return response.status(200).send({ msg: "post successfully deleted!" });
};

module.exports = { createPost, fetchPost, updatePost, deletePost };
