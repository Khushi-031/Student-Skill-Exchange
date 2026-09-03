const User=require("../MODELS/user");
const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
    
    console.log("=== Middleware Reached ===");
    console.log(req.headers);

    const authHeader = req.headers.authorization;
    console.log("full authorization header");
console.log(authHeader);
    if (!authHeader) {
        return res.status(401).send("Access denied!");
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:",token.length);
    try {
        const decoded = jwt.verify(token,"mysecurekey");
        console.log("Decoded:",decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message);
        return res.status(401).send("Invalid token!");
    }
};
 const verifyAdmin = async(req,res,next)=>{
    try{
    const user= await User.findById(req.user.id);
    if(!user){
        return res.status(404).json({
            message:"user not found"
        });
    }
    if(user.role !=="admin"){
        return res.status(403).json({
            message:"access denied!.Admin only."
        });
    }
    next();
 }catch(error){
    res.status(500).json({
        message: "server error"
    });
 }
};

module.exports = {
    verifyUser,
    verifyAdmin
};

