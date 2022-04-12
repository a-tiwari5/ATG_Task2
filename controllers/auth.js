const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')


// Register User

exports.register = asyncHandler(
    async (req, res, next) => {
        const { username, email, password } = req.body;
        const user = await new User({
            username,
            email,
            password
        })
        await user.save();
        // Create Token
        sendTokenResponse(user, 200, res);
    }
)

// Login User

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // Validate credentials
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email or password', 400))
    }
    // Check for User
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid Credentials', 401))
    }
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }
    sendTokenResponse(user, 200, res);
})
// Get a user
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    })
})

// Forgot password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorResponse("User with the given email dosen't exists!", 404))
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/forgotpassword/${resetToken}`
    console.log(resetUrl)
    const message = `You are receiving this email because you or someone else has requested the reset
     of password.Please make a PUT request to:\n\n ${resetUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset token",
            message
        })
        return res.status(200).json({ success: true, data: 'Email Sent' })
    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })
        return next(new ErrorResponse("Email could not be sent", 500))
    }
})


// Reset Password
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')
    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorResponse('Invalid Token'), 400)
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save();

    sendTokenResponse(user, 200, res)
})



// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === "production") {
        options.secure = true
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}
