const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,          
        },
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;