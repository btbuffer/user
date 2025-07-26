const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { mongoose } = require("mongoose");

const User = require("../models/user.model");

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

  const token = jwt.sign(
    { userId: foundUser.id, isAdmin: foundUser.isAdmin },
    process.env.SECRET,
    {
      expiresIn: "1h",
    }
  );

  response
    .cookie("token", token, { httpOnly: true, Secure: true })
    // .status(200)
    .send({ message: "user login successfully!" });
};

// Get all users;
const getUsers = async (request, response) => {
  const users = await User.find();
  response.send(users);
};

// Get a user
const getUser = async (request, response) => {
  const {
    params: { userId },
  } = request;
  const user = await User.findById(userId);
  response.send(user);
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

const deleteUser = async (request, response) => {
  const {
    params: { userID },
    user,
  } = request;

  // console.log(token);
  // "_id": "685c232c75402d54877fe178",
  //   "name": "Motola",
  //   "email": "motola@hotmail.com",
  //   "password": "$2b$10$5tmMJi5LV7xJTfLigU8oLOl86aQ/D6kF1kaw82PXpoR0DHhGPKocy",
  //   "isAdmin": false,
  //   "hobbies": [],
  //   "posts": [
  //     "685c232c75402d54877fe178",
  //     "685c33f4adadaaf01c1eb3b5"

  const isValid =
    mongoose.Types.ObjectId.isValid(userID) &&
    String(new mongoose.Types.ObjectId(userID)) === userID;

  if (!isValid) return response.status(400).send({ msg: "Invalid user ID" });

  if (user.userId !== userID && !user.isAdmin) {
    return response
      .status(403)
      .send({ msg: "You do not have permission to perform this action." });
  }

  const foundUser = await User.findById(userID);
  if (!foundUser) return response.status(404).send({ msg: "User not found!" });

  // const { name } = await User.findById(userID);
  await User.findByIdAndDelete("685c33f4adadaaf01c1eb3b5");

  return response.send(`${userID} deleted!`);
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
