const asyncHandler = require("express-async-handler");
const { Chat } = require("../models/chat.model");
const { User } = require("../models/user.model");

exports.fetchChat = asyncHandler(async (req, res) => {
    let chats = await Chat.find({
        users: { $elemMatch: { $eq: req.user._id } },
    })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
    chats = await User.populate(chats, {
        path: "latestMessage.sender",
        select: "name email image",
    });
    res.status(200).json(chats);
});

exports.accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ msg: "userId missing" });
    } else {
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name email image",
        });
        if (isChat.length > 0) {
            res.status(200).json(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                users: [req.user._id, userId],
            };
            try {
                const createdChat = await Chat.create(chatData);
                const fullChat = await Chat.findOne({ _id: createdChat._id })
                    .populate("users", "-password")
                    .populate("latestMessage");
                res.status(201).json({ msg: "Success", chat: fullChat });
            } catch (error) {
                res.status(400).json({ msg: "Unable to create chat" });
            }
        }
    }
});

exports.createGroupChat = asyncHandler(async (req, res) => {
    const { users, name } = req.body;
    if (!users || !name) {
        res.status(400).json({ msg: "Either users or name is empty" });
    } else {
        if (users.length < 2) {
            res.status(400).json({
                msg: "At least two users are required for a group chat",
            });
        } else {
            users.push(req.user);
            const groupChat = await Chat.create({
                isGroupChat: true,
                chatName: name,
                users,
                groupAdmin: req.user,
            });
            const fullGroupChat = await Chat.findOne({
                _id: groupChat._id,
            })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
            res.status(200).json({ msg: "Success", groupChat: fullGroupChat });
        }
    }
});

exports.renameGroupChat = asyncHandler(async (req, res) => {
    const { chatId, newGroupName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        { _id: chatId },
        { chatName: newGroupName },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(404).json({ msg: "Chat not found" });
    } else {
        res.status(200).json(updatedChat);
    }
});

exports.removeFromGroupChat = asyncHandler(async (req, res) => {
    const { userId, chatId } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        { _id: chatId },
        { $pull: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(404).json({ msg: "Chat not found" });
    } else {
        res.status(200).json(updatedChat);
    }
});

exports.addToGroupChat = asyncHandler(async (req, res) => {
    const { userId, chatId } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        { _id: chatId },
        {
            $push: { users: userId },
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(404).json({ msg: "Chat not found" });
    } else {
        res.status(200).json(updatedChat);
    }
});
