const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./MODELS/user");
const Request =require("./MODELS/Request")
console.log(require.resolve("./MIDDLEWARE/auth"));
const{ verifyUser,verifyAdmin} = require("./MIDDLEWARE/auth.js");
const app = express();
app.use(cors());
app.use(express.json());
//MONGODB CONNECTION
mongoose.connect("mongodb://127.0.0.1:27017/studentskillexchange").then(()=>{
    console.log("MongoDB connected successfully");
})
.catch((err)=>{
    console.log(err);
});
app.get("/",(req,res)=>{
    res.send("welcome to the student exchange portal!");
});
app.post("/register",async(req,res)=>{
    const {name,
           email,
           phone,
           password,
           confirmpassword,
           college ,
           semester ,
           skillsKnown,
           skillsWanted
    }=req.body;

    if(!name||!email||!phone||!password||!confirmpassword||!college||!semester||!skillsKnown||!skillsWanted){
        return res.send("please fill all the required fields !");
    }
    if(password!==confirmpassword){
       return res.send("password do not match");
    }
    if(!email.includes("@")){
        return res.send("please enter valid email");
    }
    if(phone.length!==10){
        return res.send("please enter a valid 10-digit phone number");
    }
    if(password.length<8){
        return res.send("your password must be of atleast 8 character long");
    }
    const existing_user =await 
    User.findOne({email});
    if(existing_user){
        return res.send("email already registered");
    }
    const hashedpassword =await 
    bcrypt.hash(password,10);
    const user = new User ({
        name,
        email,
        phone,
        password:hashedpassword,
        college,
        semester,
        skillsKnown,
        skillsWanted
    });
    await user.save();
    res.send("registrated successfully!");
});
app.post("/login",async(req,res)=>{

    const { email, password}=req.body;
    if(!email || !password){
        return res.send("please enter email and password");
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({
            message :"user not found.Please register first"
        });
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({
            message: "Incorrect password!"
        });
    }
    
    const token = jwt.sign(
       { id:user._id},
        "mysecurekey",
        {expiresIn:"1d"}
    );
    res.json({
        message: "login successful",
        token: token
    });
});
app.get("/profile",verifyUser,async(req,res)=>{
     const user = await User.findById(req.user.id);
     res.json(user);
});
app.put("/profile",verifyUser , async(req,res)=>{
    const user = await User.findById(req.user.id);
    if(!user){
        return res.send("user not found");
    }
    if(req.body.name){
        user.name = req.body.name;
    }
    if(req.body.phone){
        user.phone = req.body.phone;
    }
    if(req.body.college){
        user.college = req.body.college;
    }
    if(req.body.semester){
        user.semester = req.body.semester;
    }
    if(req.body.skillsKnown){
        user.skillsKnown=req.body.skillsKnown;
    }
    if(req.body.skillsWanted){
        user.skillsWanted=req.body.skillsWanted;
    }
    await user.save();
    res.send("profile updated successfully");
});

app.get("/students",verifyUser, async(req,res)=>{
        const students=await User.find().select("-password -__v");
        res.json(students);
});

app.get("/students/skill/:skill",verifyUser,async(req,res)=>{
    const skill = req.params.skill;
    const students= await User.find({
        skillsKnown:{
            $regex:skill,
            $options:"i"
             } 
    }).select("-password -__v");
    res.json(students);
});
app.get("/matches/potential" ,verifyUser,async(req,res)=>{
      const user = await User.findById(req.user.id);
      if(!user){
        return res.status(404).send("user not found");
      }
      const wantedSkills = user.skillsWanted;
      const matches = await User.find({
        skillsKnown: {$in: wantedSkills},
        _id:{$ne:user._id}
      }).select("-password -__v");
      res.json(matches);
});

//for perfect match
app.get("/matches/perfect" ,verifyUser,async(req,res)=>{
      const user = await User.findById(req.user.id);
      if(!user){
        return res.status(404).send("user not found");
      }
      const myKnownSkills = user.skillsKnown;
      const myWantedSkills = user.skillsWanted;

      const matches = await User.find({
        skillsKnown:{$in:myWantedSkills},
        skillsWanted:{$in:myKnownSkills},
        _id:{$ne:user._id}
      }).select("-password -__v");
      res.json(matches);
    });

    app.get("/students/:id",verifyUser ,async(req,res)=>{
        console.log("requiredid",req.params.id);
        const student =await User.findById(req.params.id).select("-password -__v");

        if(!student){
            return res.status(404).send("student not found");
        }
        res.json(student);
    });
    app.post("/requests/:receiverId",verifyUser,async(req,res)=>{
        if(req.user.id === req.params.receiverId)
        {
            return res.status(400).json({
                message: "you cannot send a request to yourself"
            });
        }
        const receiver = await User.findById(req.params.receiverId).select("-__v");
        
        if(!receiver){
            return res.status(404).send("receiver not found");
        }
        //DUPLICATE REQUEST CHECK
        const existingRequest = await Request.findOne({
            sender: req.user.id,
            receiver: receiver._id
        });
        if(existingRequest){
            return res.status(400).json({
                "message": "request already exist"
            });
        }
        const request = await Request.create({
              sender: req.user.id,
              receiver : receiver._id
        });
        res.status(201).json(request);
    });
    app.get("/requests",verifyUser,async (req,res)=>{
      const requests = await Request.find({
        receiver: req.user.id
           }).populate(
            "sender",
            "name email college semester skillsKnown skillWanted"
        );
           res.json(requests);
});
app.patch("/requests/:id/status", async(req,res)=>{
    try{
        const request = await Request.findByIdAndUpdate(
            req.params.id,
            {status:req.body.status},
            {new:true}
        );
        if(!request){
           // return res.status(404).send("request not found");
           return res.status(404).json({
            message:"request not found",
            receivedId:req.params.id
           });
        }
        res.json({
            message: "request status updated ",
            request: request
        });
    }catch(error){
        res.status(500).send("server error");
    } 
});
app.get("/dashboard", verifyUser,async(req,res)=>{
    const user = await User.findById(req.user.id)
    .select("-password -__v");
     if(!user){
        return res.status(404).json({
            "message":"user not found"
        });
    }
    const requests = await Request.find({
        receiver: req.user.id
    });

    const totalRequests = requests.length;
    const pendingRequest = requests.filter(
        request=> request.status ==="pending"
    ).length;

    const acceptedRequest =requests.filter(
          request=>request.status==="accepted"
    ).length;
     
    const rejectedRequest =requests.filter(
          request=>request.status==="rejected"
    ).length;

    res.json({
        user,
        requests,
        stats:{
            totalRequests,
            pendingRequest,
            acceptedRequest,
            rejectedRequest
        }
    });
});
app.get("/admin/users", verifyUser ,verifyAdmin , async(req,res)=>{
     try{
        const users = await User.find();
        res.status(200).json({
            message: "All users fetched sucessfully",
            users:users
        }).select("-password -__v");
     }catch(error){
        res.status(500).json({
            message: "server error",
            error:error.message
        });
     }
});
app.get("/admin/users/:id",verifyUser , verifyAdmin , async(req,res)=>{
    try{
        const user = await User.findById(req.params.id).select("-password -__v");
        if(!user ){
            return res.status(404).json({
                message: "user not found"
            });
        }
        res.status(200).json({
            message: "user profile fetched successfully",
            user
        });
    }catch(error){
           res.status(500).json({
            message:"server error",
            error: error.message
           });
    }
});
app.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                message: "Email and new password are required",
            });
        }

        const passwordPattern =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        if (!passwordPattern.test(newPassword)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters and contain one uppercase letter and one special character.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully",
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            message: "Server error while resetting password",
        });
    }
});


app.listen(3000,()=>{
    console.log("server is running on the port 3000");
});