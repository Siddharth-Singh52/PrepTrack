const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {

    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){

            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id);

            if(!user) {
                return res.status(401).json({
                    message: "Not authorized, user not found"
                });
            }
            req.user = user;
            next();
        }

        else{
            return res.status(401).json({
                message: "Not authorized, no token"
            });
        }
        
    }
    catch (error) {
        return res.status(401).json({
            message: error.message || "Not authorized, token failed"
        });
    }
};

module.exports = protect;