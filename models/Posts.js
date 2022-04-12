const mongoose = require('mongoose')


const PostSchmea = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 600,
        required: true
    },
    img: {
        type: String,

    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Post', PostSchmea)