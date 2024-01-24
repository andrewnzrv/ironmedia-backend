const { Schema, model } = require('mongoose')

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,     
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
    
  },
)

const Blog = model('Blog', blogSchema)

module.exports = Blog







