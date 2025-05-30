const { Schema, model } = require("mongoose");
// Field names required are:
// 1) name
// 2) email
// 3) password
// 4) isAdmin
// 5) hobbies
const UserSchema = new Schema(
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
    // {timestamps: true},
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
module.exports = User;
