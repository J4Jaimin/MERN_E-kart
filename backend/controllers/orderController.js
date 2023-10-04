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

    const order = await Order.findById(req.params.id).populate("user", "name email");

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

    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    });
});

// Get all orders -- admin

exports.getAllOrders = catchAsyncError(async (req, res, next) => {

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        Total_Amount: totalAmount
    });
});

// Update Order status -- admin

exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new Errorhandler("Order not found for this id.", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new Errorhandler("You've already delivered this order.", 400));
    }

    order.orderItems.forEach(async (items) => {
        await updateStock(items.product, items.quantity);
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered")
        order.orderStatus = "Delivered";

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

// update stock of product.

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);

    console.log(quantity);
    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}

// delete order. 

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new Errorhandler("Order not found for this id.", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        order
    });
});
