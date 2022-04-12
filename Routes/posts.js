const router = require('express').Router();
const Post = require('../models/Posts')
const { createPost, readPost, updatePost, deletePost, likedislikePost, createComment } = require('../controllers/posts')
const { protect } = require('../middlewares/auth')
// const Comment = require('../models/Comments')

// Create Post
router.post('/', protect, createPost)
// Read Post
router.get('/:id', readPost)
// Update Post
router.put('/:id', protect, updatePost)
// Delete Post
router.delete('/:id', protect, deletePost)
// Like/Dislike Post
router.put("/:id/like", protect, likedislikePost)
// Comment on a Post
router.post("/:id/comment", protect, createComment)

module.exports = router