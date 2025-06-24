const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const verifyUser = require("../middleware/auth");

const createUser = async (request, response) => {
  const { email, ...userPayload } = request.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    return response.send({ msg: "user already exist." });
  }

  const round = 10;
  const password = await bcrypt.hash(userPayload.password, round);
  const user = new User({ ...userPayload, email, password });

  await user.save();
  response.json({ userId: user.id });
};

const loginUser = async (request, response) => {
  const { email, password } = request.body;

  // alert user for invalid login credentials:
  // wrong password or email
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return response.status(404).send({ msg: "User doesn't exist" });
  }

  // compare the provided password with registered pwd.
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    return response.status(400).send({ msg: "Incorrect email or password!" });
  }

  const token = jwt.sign({ userId: foundUser.id }, process.env.SECRET, {
    expiresIn: "1h",
  });

  response
    .cookie("token", token, { httpOnly: true, Secure: true })
    .send({ message: "user login successfully!" });
};

// Get all users;
const getUsers = async (request, response) => {
  const users = await User.find();
  response.send(users);
};

const updateUser = async (request, response) => {
  const { id } = request.params;

  const foundUser = await User.findOneAndUpdate({ _id: id }, request.body, {
    new: true,
  });

  if (!foundUser)
    return response.status(404).send({ msg: "User does not exist!" });
  // 64bce457bcdfeabc12345678
  response.send(foundUser);
};

const deleteUser = async (req, res) => {
  const { id: userID } = req.params;
  const { name } = await User.findById(userID);
  await User.deleteOne({ _id: userID });

  res.send(`${name} deleted!`);
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser,
};
