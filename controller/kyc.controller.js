const { mongoose } = require("mongoose");

const Kyc = require("../models/kyc.model");
const User = require("../models/user.model");

const createKyc = async (request, response) => {
  const { user, body } = request;

  // Check a user not previously created a KYC profile
  const kycExist = await Kyc.findOne({ user: user.userId });
  if (kycExist) return response.send({ msg: "KYC already being profiled." });

  const kycProfile = new Kyc({ user: user.userId, ...body });
  await kycProfile.save();

  // Update a login user information with the KYC profile
  // details.
  await User.findByIdAndUpdate(user.userId, { kyc: kycProfile.id });

  return response.send(kycProfile);
};

const getKyc = async (request, response) => {
  const {
    params: { kycID },
  } = request;

  const isValid =
    mongoose.Types.ObjectId.isValid(kycID) &&
    String(new mongoose.Types.ObjectId(kycID)) === kycID;

  if (!isValid) return response.status(400).send({ msg: "Invalid kyc ID" });

  const foundKyc = await Kyc.findById(kycID);
  if (!foundKyc) return response.status(404).send({ msg: "Kyc not found" });
  await foundKyc.populate("user");

  return response.send(foundKyc);
};

module.exports = { createKyc, getKyc };
