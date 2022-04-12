const mongoose = require('mongoose')


const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        max: 600
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

module.exports = mongoose.model('Comment', CommentSchema)