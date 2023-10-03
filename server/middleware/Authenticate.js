
const jwt = require("jsonwebtoken");
const Userss = require("../model/userSchemass");

// const Authenticate = async (req, res, next) => {
//     try {
//         console.log("inner try");
//         console.log("Headers:", req.headers); // Log headers
//         console.log("tokensss:", req.headers.cookie); 
//         const token = req.headers.cookie;
//         // const token = req.cookies.jwtoken;
//         console.log(token);
//         const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
//         const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
//         if (!rootUser) {
//             throw new Error('User not Found');
//         }
//         req.token = token;
//         req.rootUser = rootUser;
//         req.userID = rootUser._id;
//         next();

//     } catch (err) {
//         console.log("inner catch", err);

//         res.status(401).send("Unauthorized: No token provided");
//         console.log(err);
//     }

// }

const Authenticate = async (req, res, next) => {
    try {
        console.log("inner try");
        console.log("Headers:", req.headers); // Log headers
        console.log("tokensss:", req.headers.cookie); 
        const cookies = req.headers.cookie.split('; '); // Split cookies by semicolon and space
        let token = "";
        cookies.forEach(cookie => {
            if (cookie.startsWith("jwtoken=")) {
                token = cookie.substring("jwtoken=".length); // Extract the token value
            }
        });

        if (!token) {
            throw new Error('Token not found');
        }

        console.log(token);
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await Userss.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootUser) {
            throw new Error('User not Found');
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();

    } catch (err) {
        console.log("inner catch", err);
        console.log(err);
        // res.status(401).send("Unauthorized: No token provided");
        res.status(401).json({ Unauthorized: "No token provided" });

    }
}

module.exports = Authenticate;