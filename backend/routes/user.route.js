const express = require("express");
const {
    registerUser,
    authenticateUser,
    fetchUsers,
} = require("../controllers/user.controller");
const { isAuth } = require("../middlewares/auth.middleware");
const router = express.Router();

router
    .post("/", registerUser)
    .post("/login", authenticateUser)
    .get("/", isAuth, fetchUsers);

module.exports = router;
