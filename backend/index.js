//DOTENV SETTING
const dotenv = require("dotenv");
dotenv.config();
//EXPRESS SETTING
const express = require("express");
const server = express();
server.use(express.json());

//CORS SETTING
const cors = require("cors");
server.use(cors());

server.listen(process.env.PORT, () => {
    console.log("SERVER STARTED!");
});
