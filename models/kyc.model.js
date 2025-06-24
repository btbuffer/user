const { mongoose } = require("mongoose");

const KycSchema = new mongoose.Schema({
  displayPix: {
    type: String,
    required: true,
  },
  docType: {
    type: String,
    required: true,
  },
  frontPix: {
    type: String,
    required: true,
  },
  backPix: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

const Kyc = mongoose.model("Kyc", KycSchema);

// One-to-One relationship between User and KYC
module.exports = Kyc;
