const jwt = require("jsonwebtoken");

const Kyc = require("../models/kyc.model");
const User = require("../models/user.model");

const createKyc = async (request, response) => {
  const {
    cookies: { token },
    body,
  } = request;

  let user = null;

  try {
    const decodeUser = jwt.verify(token, process.env.SECRET);
    user = decodeUser;
  } catch (err) {
    user = { userId: null, error: err.message };
  }

  if (!user.userId) return response.status(400).send({ msg: "Unauthorized" });

  const kycExist = await Kyc.findOne({ user: user.userId });
  if (kycExist) return response.send({ msg: "KYC already being profiled." });

  const kycProfile = new Kyc({ user: user.userId, ...body });
  await kycProfile.save();

  await User.findByIdAndUpdate(user.userId, { kyc: kycProfile.id });

  // const decodeUser = jwt.verify();

  // console.log("Creating KYC...");
  return response.send(kycProfile);
};

const getKyc = async (request, response) => {
  const {
    params: { kycID },
  } = request;
  const foundKyc = await Kyc.findById(kycID).populate("user");

  return response.send(foundKyc);
};

module.exports = { createKyc, getKyc };
