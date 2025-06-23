const { mongoose } = require("mongoose");
const Post = require("../models/post.model");

// Create a post after a successful login
const createPost = async (request, response) => {
  if (!request.user) {
    return response
      .status(401)
      .send({ msg: "Unauthorized resource! please, login" });
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
  if (!request.user) {
    return response.status(401).send({ msg: "Unauthorized! Please, login." });
  }

  const {
    params: { postId },
    body,
  } = request;

  const isValid =
    mongoose.Types.ObjectId.isValid(postId) &&
    String(new mongoose.Types.ObjectId(postId)) === postId;

  if (!isValid) return response.status(400).send({ msg: "Invalid post ID" });

  const post = (postExist = await Post.findById(postId));
  if (!postExist) {
    return res.json({ message: "Post not found" });
  }

  if (post.creatorId.toString() === userId) {
    console.log(otherPayload);
    const postUpdated = await Post.findByIdAndUpdate(
      postId,
      { ...otherPayload },
      { returnOriginal: false }
    );
    return res.json(postUpdated);
  }

  res.json({
    message: "Unauthorized resources! You are not the author of this post.",
  });
};

// Delete a post only if a user is the
// author of the post.
const deletePost = async (req, res) => {
  // Retrieve the post target for deletion
  const { postId } = req.params;
  // And get a author's id
  const { userId } = req.body;

  // send "post not found" response if the post targets
  // by postId does not exist in the data storage.
  const post = (postExist = await Post.findById(postId));
  if (!postExist) {
    return res.json({ message: "Post not found" });
  }

  // Verify the ownership of the post and ensure
  // the author of the post is one deleting a post.
  if (post.creatorId?.toString() === userId) {
    await Post.deleteOne({ _id: postId });
    return res.json({ message: "post successfully deleted!" });
  }

  // Respond with "Unauthorized resources" for wrong
  // ownership.
  res.json({ message: "Unauthorized resources!" });
};

module.exports = { createPost, fetchPost, updatePost, deletePost };
