const express = require("express");
const {
    registerUser,
    authenticateUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/", registerUser).post("/login", authenticateUser);

module.exports = router;
