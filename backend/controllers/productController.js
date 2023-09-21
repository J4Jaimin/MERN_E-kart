const Product = require("../models/products");

// create product -- admin

exports.createProduct = async (req, res, next) => {
    console.log(req.body);
    const product = await Product.create(req.body);

    console.log(product);

    res.status(201).json({
        success: true,
        product
    });
}

// Get all products information -- admin

exports.getAllProducts = async (req, res, next) => {
    const products = await Product.find();

    res.status(201).json({
        success: true,
        products
    });
}

// Update product -- admin

exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        res.status(500).json({
            success: false,
            message: "No product found!"
        });
    }
    else {
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
    }
}

// Delete a product -- admin

exports.deleteProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        res.status(500).json({
            success: false,
            message: "No product found!"
        });
    }
    else {
        product.deleteOne();
        res.status(200).json({
            success: true,
            message: "Product deleted successfully!"
        });
    }
}