const asyncHandler = require("express-async-handler");
const { Message } = require("../models/message.model");
const { User } = require("../models/user.model");
const { Chat } = require("../models/chat.model");

exports.sendMessage = asyncHandler(async (req, res) => {
    const { msg, chatId } = req.body;
    if (!msg || !chatId) {
        res.status(400).msg({ msg: "Invalid data" });
    }
    const newMessage = {
        sender: req.user._id,
        content: msg,
        chat: chatId,
    };
    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name image");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name image email",
        });
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
        res.status(200).json({ msg: "Success", message });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
});

exports.fetchAllMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.id })
            .populate("sender", "name email image")
            .populate("chat");
        res.status(200).json({ msg: "Success", messages });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
});
