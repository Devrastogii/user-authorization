require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const  user_schema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userPhone: {
        type: Number,
        required: true,
        unique: true     
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userCPassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true            
        }
    }]
})

user_schema.methods.generateToken = async function(){
    const token = await jwt.sign({_id:this._id}, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token});   
    await this.save();
    return token;
}

user_schema.methods.generateLogToken = async function() {
    const token = await jwt.sign({_id:this._id}, process.env.SECRET_KEY);         
    return token;
}

user_schema.pre("save", async function(next) {
    if (this.isModified("userPassword")) {
        this.userPassword = await bcrypt.hash(this.userPassword, 12);
        this.userCPassword = await bcrypt.hash(this.userCPassword, 12);
    }

    next();
})

const User_Collection = new mongoose.model("User", user_schema);

module.exports = User_Collection;