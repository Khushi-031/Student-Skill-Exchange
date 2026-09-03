const mongoose = require("mongoose");
const verifyUser = require("../MIDDLEWARE/auth");
const requestSchema =new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    status:{
        type: String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    }
});
module.exports = mongoose.model("Request",requestSchema);