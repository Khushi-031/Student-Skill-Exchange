const mongoose = require("mongoose");
const User= require("./MODELS/user");
mongoose.connect("mongodb://127.0.0.1:27017/studentskillexchange").then(async()=>{
    console.log("MongoDB connected successfully");
const result = await User.updateOne(
    { email:"teststudents@gmail.com"},
    {$set:{role: "admin"}}
);
console.log(result);
await mongoose.disconnect();
})
.catch((err)=>{
    console.log(err);
});