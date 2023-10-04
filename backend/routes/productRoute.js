const express = require("express");
const { getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetail,
    createOrUpdateProductReview,
    getAllReviewsOfProduct,
    deleteAReviewOfProduct,
    updateProductStock } = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/admin/stock/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProductStock);

router.route("/product/:id").get(getProductDetail);

router.route("/product/addreview").put(isAuthenticatedUser, createOrUpdateProductReview);

router.route("/product/reviews/:id").get(getAllReviewsOfProduct);

router.route("/product/reviews").delete(isAuthenticatedUser, deleteAReviewOfProduct);

module.exports = router;