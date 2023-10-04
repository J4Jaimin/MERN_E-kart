const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus)
    .delete(isAuthenticatedUser, deleteOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/orders/all").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

module.exports = router;