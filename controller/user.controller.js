const User = require("../models/user.model");

// Create user with the following attr:
// name, email, password, isAdmin, hobbies
const createUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();

  res.json(user);
};

// Get all users;
const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const updateUser = async (req, res) => {
  const { id: userID } = req.params;
  // const {, ...others} = req.body;

  const updatedUser = await User.findOneAndUpdate({ _id: userID }, req.body, {
    returnOriginal: false,
  });
  res.json(updatedUser);
};

const deleteUser = async (req, res) => {
  const { id: userID } = req.params;
  const { name } = await User.findById(userID);
  await User.deleteOne({ _id: userID });

  res.send(`${name} deleted!`);
};

module.exports = { createUser, getUsers, updateUser, deleteUser };
