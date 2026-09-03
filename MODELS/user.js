const mongoose = require("mongoose");
const userschema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    password:String,
    college:String,
    semester:String,
    skillsKnown:{
        type:[String],
        default:[]
    },
    skillsWanted:{
        type:[String],
        default:[]
    },
  role:{
    type: String,
    enum:["student","admin"],
    default: "student"
}
});
const user = mongoose.model("User",userschema);
module.exports= user;