const { errorHandler, notFound } = require("./middlewares/error.middleware");
//DOTENV SETTING
const dotenv = require("dotenv");
dotenv.config();
//EXPRESS SETTING
const express = require("express");
const server = express();
server.use(express.json());

//CORS SETTING
const cors = require("cors");
const { connectDB } = require("./config/db");
server.use(cors());

//ROUTES
const userRoutes = require("./routes/user.route");
server.use("/api/user", userRoutes);
const chatRoutes = require("./routes/chat.route");
server.use("/api/chat", chatRoutes);
const messageRoutes = require("./routes/message.route");
server.use("/api/message", messageRoutes);

//ERROR HANDLING MIDDLEWARES
server.use(notFound);
server.use(errorHandler);

//SOCKET IO
const socketIO = require("socket.io");

connectDB().then(() => {
    const activeServer = server.listen(process.env.PORT, () => {
        console.log("SERVER STARTED!");
    });

    //CONNECTING SOCKET IO
    const socketSetting = {
        pingTimeout: 60000,
        cors: {
            origin: process.env.CLIENT_ORIGIN,
        },
    };
    const socket = socketIO(activeServer, socketSetting);
    socket.on("connection", (skt) => {
        console.log("CONNECTED TO SOCKET.IO!");
        skt.on("setup", (userId) => {
            console.log("User:", userId);
            skt.join(userId);
            skt.emit("connected");
        });
        skt.on("join_chat", (room) => {
            console.log("User joined room:", room);
            skt.join(room);
        });
        skt.on("new_message", (newMessageReceived) => {
            const chat = newMessageReceived.chat;
            if (!chat.users) {
                console.log("chat.users not defined!");
                return;
            }
            chat.users.forEach((user) => {
                if (user._id === newMessageReceived.sender._id) {
                    return;
                }
                console.log(newMessageReceived);
                skt.in(user._id).emit("message_received", newMessageReceived);
            });
        });
        skt.on("typing", (room) => {
            skt.in(room).emit("typing");
        });
        skt.on("stop_typing", (room) => {
            skt.in(room).emit("stop_typing");
        });
        skt.off("setup", () => {
            console.log("USER DISCONNECTED. CLOSING SOCKET!");
            skt.leave(userData._id);
        });
    });
});
