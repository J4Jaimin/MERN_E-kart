const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/asyncerrorhandler");
const User = require("../models/userModel");
const sendToken = require("../utils/sendJWTtoken");

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
})