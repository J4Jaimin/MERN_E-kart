const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/asyncerrorhandler");
const User = require("../models/userModel");
const sendToken = require("../utils/sendJWTtoken");
const sendEmail = require("../utils/sendEmail.js");

// register a user

exports.createUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        avatar: {
            public_id: "This is a sample id.",
            url: "profilepicurl"
        }
    });

    sendToken(user, 201, res);
});

// Login a user

exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    // checking if user has given password and email both.

    if (!email || !password) {
        return next(new Errorhandler("Please enter email and password"), 400);
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new Errorhandler("Invalid email and password"), 401);
    }

    const isPasswordMatched = user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new Errorhandler("Invalid email and password"), 401);
    }

    sendToken(user, 200, res);
});

// Logout a user

exports.logoutUser = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully."
    });
});

// Forgot password

exports.forgotPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new Errorhandler("User not found"), 404);
    }

    // Get reset password token

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset link :- \n\n ${resetPasswordUrl}`;

    try {

        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password recovery",
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new Errorhandler(error.message, 500));
    }
});