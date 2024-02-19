const express = require("express");
const { isAuth } = require("../middlewares/auth.middleware");
const {
    fetchChat,
    accessChat,
    createGroupChat,
    renameGroupChat,
    removeFromGroupChat,
    addToGroupChat,
} = require("../controllers/chat.controller");
const router = express.Router();

router
    .get("/", isAuth, fetchChat)
    .post("/", isAuth, accessChat)
    .post("/group", isAuth, createGroupChat)
    .put("/group/rename", isAuth, renameGroupChat)
    .put("/group/remove", isAuth, removeFromGroupChat)
    .put("/group/add", isAuth, addToGroupChat);

module.exports = router;
