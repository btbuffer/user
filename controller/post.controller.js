const { mongoose } = require("mongoose");
const Post = require("../models/post.model");
const User = require("../models/user.model");

// Create a post
const createPost = async (request, response) => {
  const {
    user: { userId },
    body,
  } = request;

  const post = new Post({ ...body, creator: userId });
  await post.save();
  // First Method:
  // const user = await User.findById(userId);
  // console.log("USER: ", user);
  // const posts = user.posts.push(post.id);
  // console.log("POSTS: ", posts);
  // await User.findByIdAndUpdate(userId, { posts: user });

  // Second Method:
  await User.findByIdAndUpdate(userId, { $push: { posts: post.id } });
  return response.json({ postId: post.id });
};

// Fetch all post
const fetchAllPost = async (request, response) => {
  const allPosts = await Post.find();
  return response.send({ posts: allPosts });
};

// Retrieve a post
const fetchPost = async (request, response) => {
  const {
    post: { foundPost },
  } = request;

  return response.status(200).send(foundPost);
};

// Update a post
const updatePost = async (request, response) => {
  const {
    user,
    post: { postId, foundPost },
    body,
  } = request;
  // Allow Post update only if the post's author is the one
  // making the changes. Otherwise, respond with 403 status
  // code: performed action is forbidden.
  if (user.userId !== foundPost.creator.toString())
    return response
      .status(403)
      .send({ msg: "You do not have permission to perform this action." });

  const updatedPost = await Post.findByIdAndUpdate(postId, body, {
    new: true,
  });

  return response.status(200).json(updatedPost);
};

// Delete a post.
const deletePost = async (request, response) => {
  const {
    post: { postId, foundPost },
    user,
  } = request;

  // Don't allow post deletion if a user is not the author
  // and/or not the admin. And respond with 403 status
  // code: performed action is forbidden, i.e.,

  // isOwner AND notAdmin === false && true = Have permission
  // notOwner AND notAdmin === true && true = Do not have permission
  // notOwner AND isAdmin === true && false = Have permission
  // isOwner AND isAdmin === false && false = Havve permission
  if (user.userId !== foundPost.creator.toString() && !user.isAdmin)
    return response
      .status(403)
      .send({ msg: "You do not have permission to perform this action." });

  await Post.findByIdAndDelete(postId);
  return response.status(200).send({ msg: "post successfully deleted!" });
};

module.exports = {
  createPost,
  fetchAllPost,
  fetchPost,
  updatePost,
  deletePost,
};
