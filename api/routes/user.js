const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

router.post("/signup", UserController.signup_user);

router.post("/login", UserController.login_user);

router.delete("/:userID", checkAuth, UserController.delete_user);

module.exports = router;