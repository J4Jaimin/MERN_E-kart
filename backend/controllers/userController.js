const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/asyncerrorhandler");
const User = require("../models/userModel");
const sendToken = require("../utils/sendJWTtoken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

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

    const isPasswordMatched = await user.comparePassword(password);

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

// Reset password

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new Errorhandler("Reset password token is invalid or has been expired."), 400);
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new Errorhandler("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Get user details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

// Update user password

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new Errorhandler("Old password is incorrect."), 400);
    }

    if (req.body.newPassword != req.body.confirmPassword) {
        return next(new Errorhandler("Password does not match."), 400);
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// Update profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {

    const newUser = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUser, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    });

    await user.save();

    res.status(200).json({
        success: true
    });
});

// Get all user details. -- admin

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});

// Get single user detail. -- admin

exports.getParticularUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new Errorhandler(`User does not exist with this id: ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true,
        user
    });
});

// Change the role of any user. -- admin

exports.changeRoleOfUser = catchAsyncError(async (req, res, next) => {
    const role = req.body.role

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new Errorhandler(`User does not exist with this id: ${req.params.id}`, 400));
    }

    user.role = role;

    await user.save({ validateBeforeSave: true });

    res.status(200).json({
        success: true,
        user
    });
});

// Delete user. -- admin

exports.deleteAUser = catchAsyncError(async (req, res, next) => {

});