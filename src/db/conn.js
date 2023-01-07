const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/user_authorization", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("Connected")).catch((error) => console.log(error));