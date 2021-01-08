//A Typical middleware in nodejs, it is just a function that is executed on the incomign request
//like multer. E.G. in router.post .. (req, res, next) => {...} is just a middleware.
//That is why i can have as many args as i want, they are just middlewares
//I can add any middleware after the path e.g. "api/posts...", HERE and before (req, res, next)


const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // see interceptor
        const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        }//new field, i am using it to the next middleware (check router.post in posts)
        next();
    } catch (error) {
        res.status(401).json({message: "You are not authenticated", error: error});
    }
};