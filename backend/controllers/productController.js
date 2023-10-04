const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/asyncerrorhandler");
const ApiFeatures = require("../utils/apifeatures");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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
        products,
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

// Add or update reviews of product.

exports.createOrUpdateProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user.id,
        name: req.user.name,
        rating,
        comment,
    }
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(review => review.user.toString() === req.user.id);

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user.id.toString()) {
                rev.rating = review.rating,
                    rev.comment = review.comment
            }
        });
    }
    else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }

    let sumOfRating = 0;

    product.reviews.forEach((rev) => {
        sumOfRating += rev.rating;
    })

    product.ratings = sumOfRating / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

// update stock of product -- admin

exports.updateProductStock = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    product.stock += req.body.stock;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        product
    });
});

// Get all review of Particular product

exports.getAllReviewsOfProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        next(new Errorhandler("Product not found!"), 404);
    }

    res.status(201).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete Review

exports.deleteAReviewOfProduct = catchAsyncError(async (req, res, next) => {

    console.log(req.query.productId);
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new Errorhandler("Product not found!"), 404);
    }

    let lenOfReviews = product.reviews.length;

    product.reviews.forEach((rev, index) => {
        if (rev._id.toString() === req.query.reviewId.toString() && rev.user.toString() === req.user.id.toString()) {
            product.reviews.splice(index, 1);
            next();
        }
    });

    if (product.reviews.length === lenOfReviews - 1) {
        let sumOfRating = 0;

        product.reviews.forEach((rev) => {
            sumOfRating += rev.rating;
        })

        product.reviews.ratings = sumOfRating / product.reviews.length;

        product.reviews.numberOfReviews = product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(201).json({
            success: true,
            message: `Your review deleted successfully for this product: "${product.name}"`,
        });
    }
    else {
        return next(new Errorhandler("You haven't access to delete other's review."));
    }
});
