const { Schema, model } = require("mongoose");

const blogPostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BlogPost = model("BlogPost", blogPostSchema);

module.exports = BlogPost;
