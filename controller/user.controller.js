const bcrypt = require("bcrypt");

const User = require("../models/user.model");

// Create user with the following attr:
// name, email, password, isAdmin, hobbies
const createUser = async (req, res) => {
  const { password, email, ...others } = req.body;
  const emailExist = await User.findOne({ email });

  if (emailExist) {
    res.send("User already exist!");
  }

  try {
    const salt = 5;
    const hashedPwd = await bcrypt.hash(password, salt);
    const user = new User({ password: hashedPwd, email, ...others });
    await user.save();
    res.json(user);
  } catch (error) {
    res.json({ message: "Error hashing password" });
  }
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
