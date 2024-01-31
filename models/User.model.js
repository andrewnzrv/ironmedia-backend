const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    hashedPassword: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    blogPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogPost",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
