const express = require("express");
const { isAuth } = require("../middlewares/auth.middleware");
const { fetchAllMessages, sendMessage } = require("../controllers/message.controller");
const router = express.Router();

router.post("/", isAuth, sendMessage).get("/:id", isAuth, fetchAllMessages);

module.exports = router;
