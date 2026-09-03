import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
function Login(){
    const navigate = useNavigate();
    const [error,setError]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
        const response = await 
        fetch("http://localhost:3000/Login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                email,
                password,
            }),
        });
        const data = await response.json();
        console.log("login response",data);
        if(!response.ok){
            setError(data.message);
            return;
        }
        //save jwt token
        localStorage.setItem("token",data.token);
        navigate("/dashboard");
        console.log("token saved");
        //call  protected profile route
        const profileResponse = await 
        fetch("http://localhost:3000/profile",{
            method:"GET",
            headers:{
                "Authorization": `Bearer ${data.token}`,
            },
        });
        const profileData = await
        profileResponse.json();
        console.log("profile",profileData);
    }catch(error){
        console.log("login error",error);
    }
};
   
        return (
    <div className="login-page">

        <div className="login-card">

            <h1>Welcome Back 👋</h1>

            <p className="login-subtitle">
                Login to your Student Skill Exchange account
            </p>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label> Enter your Email</label>
                    <input
                        type="email"
                        placeholder="e.g.abc@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label> Enter your Password</label>
                    <input
                        type="password"
                        placeholder="e.g. abc@123#"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="forgot-password">
                    <a
                     href="#"
                     onClick={(e)=>{
                        e.preventDefault();
                        navigate("/reset-password");
                     }}
                     >
                        Forgot Password?</a>
                </div>
                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}
                <button type="submit" className="login-btn">
                    Login
                </button>

            </form>

            <p className="register-text">
                Don't have an account?{" "}
                <Link to="/register">Register</Link>
            </p>

        </div>

    </div>
);


}
export default Login;