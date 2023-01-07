const jwt = require("jsonwebtoken");
const User_Collection = require("./models/schema");

const auth = async (req, res, next) => {
    try {
    const token = req.cookies.login;    
    if(token != null){
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);    
        const user = await User_Collection.findOne({_id:verifyUser._id});   
        req.token = token;
        req.user = user;
        next();
    }  else {
        res.render("logout");
    }
   
    } catch (error) {
        res.send(error);
    }    
}

module.exports = auth;