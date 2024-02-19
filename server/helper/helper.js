const { generateToken } = require("../config/generateToken");

exports.sanitizeUser = (user) => {
    return {
        msg: "Success",
        user: {
            // _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            image: user.image,
            token: generateToken(user._id),
        },
    };
};
