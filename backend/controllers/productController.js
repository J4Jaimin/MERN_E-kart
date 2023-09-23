const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/asyncerrorhandler");
const ApiFeatures = require("../utils/apifeatures");

// create product -- admin

exports.createProduct = catchAsyncError(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    console.log(product);

    res.status(201).json({
        success: true,
        product
    });
});

// Get all products information -- admin

exports.getAllProducts = catchAsyncError(async (req, res, next) => {

    const resultsPerPage = 5;
    const productCount = Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultsPerPage);

    const products = await apiFeature.query;

    res.status(201).json({
        success: true,
        products
    });
});

// Get specific product details. -- admin

exports.getProductDetail = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Errorhandler("Product not found!", 404));
    }

    res.status(200).json({
        success: true,
        product
    });

});

// Update product -- admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Errorhandler("Product not found!", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators: true,
            useFindAndModify: true
        });
    res.status(200).json({
        success: true,
        product
    });
});

// Delete a product -- admin

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Errorhandler("Product not found!", 404));
    }
    product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product deleted successfully!"
    });
});     
