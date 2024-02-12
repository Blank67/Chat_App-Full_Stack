const asyncHandler = require("express-async-handler");
const { User } = require("../models/user.model");
const { sanitizeUser } = require("../helper/helper");

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, image } = req.body;
    if (!name || !email || !password) {
        res.status(400).msg({ msg: "Please enter all the fields" });
        // throw new Error("Please enter all the fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ msg: "User already exists" });
        // throw new Error("User already exists");
    } else {
        const user = await User.create({
            name,
            email,
            password,
            image: !image ? undefined : image,
        });
        if (user) {
            res.status(201).json(sanitizeUser(user));
        } else {
            res.status(400).json({ msg: "Failed to create user" });
            // throw new Error("Failed to create user");
        }
    }
});

exports.authenticateUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.status(200).json(sanitizeUser(user));
    } else {
        res.status(401).json({ msg: "Invalid Email or Password" });
        // throw new Error("Invalid Email or Password");
    }
});

exports.fetchUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
              $or: [
                  { name: { $regex: req.query.search, $options: "i" } },
                  { email: { $regex: req.query.search, $options: "i" } },
              ],
          }
        : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
    const sanitizedUsers = users.map((user) => ({
        _id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
    }));
    res.status(200).json({ msg: "Success", users: sanitizedUsers });
});
