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
const { errorHandler, notFound } = require("./middlewares/error.middleware");
server.use("/api/user", userRoutes);

//ERROR HANDLING MIDDLEWARES
server.use(notFound);
server.use(errorHandler);

connectDB().then(() => {
    server.listen(process.env.PORT, () => {
        console.log("SERVER STARTED!");
    });
});
