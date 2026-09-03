import "./Profile.css";
import { useEffect, useState } from "react";
function Profile(){
    const [user , setUser]= useState(null);
    const[message , setMessage] =useState("");
    const handleChange=(e)=>{
        setUser({
            ...user, //take all the existing properties from user & copy them into new obj
            [e.target.name]:e.target.value, //target which key wants to change and new value
        });
    };
    const handleSubmit = async(e)=>{
        e.preventDefault();
        
        //PHONE VALIDATION
        if(!/^[0-9]{10}$/.test(user.phone)){
            alert("please enter a valid 10 digit number");
            return;
        }
        //CHECK REQUIRED FIELDS
        if(
            !user.name.trim()||
            !user.phone.trim()||
             !user.college.trim()||
              !user.semester.trim()||
               user.skillsKnown.length===0||
                user.skillsWanted.length===0

        ){
            alert("please fill all the required fields");
            return ;
        }
        
        const token = localStorage.getItem("token");
        const response= await 
        fetch("http://localhost:3000/profile",{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`,
            },
            body:JSON.stringify(user),
        });
        
        const data = await response.text();
        console.log("Update response",data);
        if(response.ok){
         setMessage("profile saved successfully!");
         setTimeout(()=>{
            setMessage("");
         },3000);
        }
   
    };
    useEffect(()=>{
        const fetchProfile= async()=>{
            const token =localStorage.getItem("token");
            const response = await 
            fetch("http://localhost:3000/profile",{
              headers:{
                Authorization:`Bearer ${token}`,
              },
            });
    const data = await response.json();
    console.log("Profile data",data);
    setUser(data);
};
fetchProfile();
},[]);
if(!user){
    return <h2> Loading profile...</h2>;
}
return (
    <div className="profile-page">
        
    <div className="profile-card">
        
    <div className="profile-header">
        <h1> My Profile </h1>
        <p>Manage your personal information and skills</p>
        </div>
        <form onSubmit={handleSubmit}>
       <label>
        Enter your name :
        <span className="required-star">*</span>
        <input 
        type="text"
        name="name"
        value={user.name}
        onChange={handleChange}
        required
        />
       </label>

        <label>
        Enter your Email:
        <span className="required-star">*</span>
        <input 
        type="text"
        name="email"
        value={user.email}
        // onChange={handleChange}
        readOnly
        required
        />
       </label>
       
        <label>
       Enter your phone number :
       <span className="required-star">*</span>
        <input 
        type="tel"
        name="phone"
        value={user.phone}
        onChange={handleChange}
        maxLength="10"
        required
        />
        {user.phone && user.phone.length !==10 &&(
            <p className="phone-error">
                please enter a valid 10 digit phone number
            </p>
        )}
       </label>
    
        <label>
        Enter your college name :
        <span className="required-star">*</span>
        <input 
        type="text"
        name="college"
        value={user.college}
        onChange={handleChange}
        required
        />
       </label>
        
         <label>
        Enter your semester:
        <span className="required-star">*</span>
        <input 
        type="text"
        name="semester"
        value={user.semester}
        onChange={handleChange}
        required
        />
       </label>

        <label>
        Skills I Know:
        <span className="required-star">*</span>
        <input 
        type="text"
        name="skillsKnown"
        value={user.skillsKnown}
        onChange={handleChange}
        />
       </label>

        <label>
        Skills I want to learn:<span
         className="required-star">*</span>
        <input 
        type="text"
        name="skillsWanted"
        value={user.skillsWanted}
        onChange={handleChange}
        />
       </label>
       <div className="save-profile-row">
      <button type="submit"> Save Profile </button>
      {message && (
            <span className="profle-message">
                {message}
            </span>
        )}
        </div>
      </form>
      </div>
    </div>
);
}
export default Profile;

