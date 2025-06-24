const mongoose = require("mongoose");
// Field names required are:
// 1) name
// 2) email
// 3) password
// 4) isAdmin
// 5) hobbies
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hobbies: [String],
    kyc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kyc",
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
