const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/asyncerrorhandler");

// create new order

exports.newOrder = catchAsyncError(async (req, res, next) => {
    const { shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now,
        user: req.user.id
    });

    res.status(201).json({
        success: true,
        order
    });
});

// Get single order

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {

    const order = Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new Errorhandler("Order not found for this id."), 404);
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Get logged in order.

exports.myOrders = catchAsyncError(async (req, res, next) => {

    const orders = Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    });
});