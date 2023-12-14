const mongoose = require("mongoose");

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log("DB connected!");
    } catch (error) {
        console.log("Error connecting DB: ", error);
        process.exit();
    }
};
