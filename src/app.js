const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const User_Collection = require("./models/schema");
const bcrypt = require("bcryptjs");
const auth = require("./auth");
const cookieParser = require("cookie-parser");
require("./db/conn");
const port = process.env.PORT || 8000;

const staticPath = path.join(__dirname, "../public");
app.use(express.static(staticPath));

const partialPath = path.join(__dirname, "../views/partials");
hbs.registerPartials(partialPath);

app.set("view engine", "hbs");
app.get("", (req,res) => {
    res.render("home");
})

app.get("/sign", (req,res) => {
    res.render("sign");
})

app.get("/log", (req,res) => {
    res.render("log");
})

app.get("/show", (req,res) => {
    res.render("show");
})

app.get("/afterLog", (req,res) => {
    res.render("afterLog");
})

app.get("/password", (req,res) => {
    res.render("password");
})

app.get("/logError", (req,res) => {
    res.render("logError");
})

app.get("/exists", (req,res) => {
    res.render("exists");
})

app.use(cookieParser());

app.get("/secret", auth, (req, res) => {
    if(auth){
    res.render("secret");
    }
    else {
        res.render("login");
    }
})

app.get("/logout", auth, async (req,res) => {
    res.clearCookie("login");
    await req.user.save();

    res.render("logout");
})

app.use(express.urlencoded({extended: false}))

app.post("/show", async (req,res) => {
    try {
        const p = req.body.userPassword;
        const cp = req.body.userCPassword;  
        const email = req.body.userEmail;
        
        const findData = await User_Collection.findOne({userEmail:email}); 

        if(findData != null){
            res.render("exists");
        }
        
        else {
        if(p == cp){
    
        const userDocument = new User_Collection({
            userName: req.body.userName,
            userPhone: req.body.userPhone,
            userEmail: req.body.userEmail,
            userPassword: p,
            userCPassword: cp
        })

        const token = await userDocument.generateToken();        
        const result = await userDocument.save();       
        res.render("show");

    } else {
        res.render("password");
    }
}

    } catch (error) {
        res.send(error);        
    }
   
})

app.post("/log", async (req,res) => {
    try {
        const p = req.body.userPassword;
        const email = req.body.userEmail;

        const findData = await User_Collection.findOne({userEmail:email});    

        if(findData == null){
            res.render("logError");
        } else {
            const matchPassword = await bcrypt.compare(p, findData.userPassword);
            if(matchPassword){
                res.render("afterLog");
                const token = await findData.generateLogToken(); 
                res.cookie("login", token, {
                    expires: new Date(Date.now() + 3000000),
                    httpOnly: true
                })                
            } else {
            res.render("logError");
        }
        }           

    } catch (error) {
        res.send(error);        
    }
   
})

app.get("error", (req,res) => {
    res.render("error");
})

app.get("*", (req,res) => {
    res.render("error");
})

app.listen(port, () => {
    console.log("Listening");
})