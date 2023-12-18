const express = require("express");
const {
    registerUser,
    authenticateUser,
    fetchAllUsers,
} = require("../controllers/user.controller");
const { isAuth } = require("../middlewares/auth.middleware");
const router = express.Router();

router
    .post("/", registerUser)
    .post("/login", authenticateUser)
    .get("/", isAuth, fetchAllUsers);

module.exports = router;
