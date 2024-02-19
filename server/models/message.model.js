const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    },
    { timestamps: true }
);

exports.Message = mongoose.model("Message", messageSchema);
