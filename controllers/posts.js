const Post = require('../models/Posts')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const Comment = require('../models/Comments')


exports.createPost = asyncHandler(async (req, res, next) => {
    const newPost = await new Post({
        userId: req.user._id,
        ...req.body
    });
    const savedPost = await newPost.save();
    res.status(201).json({ success: true, data: savedPost })
})

exports.readPost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        return next(new ErrorResponse(`Post not in the db,not found with the id of ${id}`, 404))
    }
    res.status(201).json({ success: true, data: post })
})


exports.updatePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    if (!post) {
        return next(new ErrorResponse(`Post not in the db,not found with the id of ${id}`, 404))
    }
    if (post.userId === req.user.id) {
        await post.updateOne({ $set: req.body })
        res.status(201).json({ success: true, msg: "Post has been updated" })
    } else {
        res.status(403).json({ success: "false", msg: "You can update only your post" })
    }
})

exports.deletePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    if (!post) {
        return next(new ErrorResponse(`Post not in the db,not found with the id of ${id}`, 404))
    }
    if (post.userId === req.user.id) {
        await post.deleteOne()
        res.status(200).json("Post has been deleted")
    } else {
        res.status(403).json({ success: false, msg: "You can delete only your post" })
    }
})

exports.likedislikePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        return next(new ErrorResponse(`Post not in the db,not found with the id of ${id}`, 404))
    }
    if (!post.likes.includes(req.user.id)) {
        await post.updateOne({ $push: { likes: req.user.id } })
        res.status(200).json("You have liked the post.")
    } else {
        await post.updateOne({ $pull: { likes: req.user.id } })
        res.status(200).json("You have disliked the post.")
    }
})


exports.createComment = asyncHandler(async (req, res, next) => {
    const comment = new Comment(req.body);
    const post = await Post.findById(req.params.id)
    comment.userId = req.user.id;
    post.comments.push(comment._id)
    await comment.save();
    await post.save();
    res.status(201).json({ success: true, data: comment })
})