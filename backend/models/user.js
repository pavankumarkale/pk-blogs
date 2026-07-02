const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
  type: String,
  default: "",
},
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},

resetPasswordToken: {
  type: String,
  default: "",
},

resetPasswordExpires: {
  type: Date,
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);