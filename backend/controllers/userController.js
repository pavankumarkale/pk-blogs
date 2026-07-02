const bcrypt = require("bcryptjs");

const crypto = require("crypto");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const generateToken = require("../utils/generateToken");

const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await sendEmail(
  user.email,
  "Welcome to Blogify 🎉",
  `Hello ${user.name},

Welcome to Blogify!

Your account has been created successfully.

Happy Blogging!

- Blogify Team`
);

    res.status(201).json({
  message: "User Registered Successfully",
 user: {
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
},
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    res.status(200).json({
      message: "Login Successful",
      token: generateToken(user._id),

      user: {
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
},
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate Reset Token
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires =
      Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    const resetLink =
      `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      `Click the link below to reset your password:

${resetLink}

This link expires in 1 hour.`
    );

    res.status(200).json({
      message:
        "Password reset email sent successfully.",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;

    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {

      return res.status(400).json({
        message: "Invalid or expired reset token.",
      });

    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      password,
      salt
    );

    user.resetPasswordToken = "";

    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully.",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Count posts created by the user
const totalPosts = await Post.countDocuments({
  author: user._id,
});

// Count comments created by the user
const totalComments = await Comment.countDocuments({
  user: user._id,
});

res.status(200).json({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  createdAt: user.createdAt,
  totalPosts,
  totalComments,
});

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const updateUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update name
    user.name = req.body.name || user.name;

    // Hash password before saving
    if (req.body.password && req.body.password.trim() !== "") {

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(
        req.body.password,
        salt
      );

      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

 res.status(200).json({
  _id: updatedUser._id,
  name: updatedUser.name,
  email: updatedUser.email,
  role: updatedUser.role,
  profileImage: updatedUser.profileImage,
  message: "Profile Updated Successfully",
});

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const uploadProfileImage = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    if (!req.file) {

      return res.status(400).json({
        message: "Please upload an image",
      });

    }

    user.profileImage = `/uploads/${req.file.filename}`;

    await user.save();

    res.status(200).json({

      message: "Profile image uploaded successfully",

      profileImage: user.profileImage,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
};

