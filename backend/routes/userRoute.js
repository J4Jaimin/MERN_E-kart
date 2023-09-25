const express = require("express");
const { createUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getParticularUserDetails,
    changeRoleOfUser } = require("../controllers/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(createUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logoutUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/admin/users/all").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router.route("/admin/users/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getParticularUserDetails);

router.route("/admin/users/update/role/:id").patch(isAuthenticatedUser, authorizeRoles("admin"), changeRoleOfUser);


module.exports = router