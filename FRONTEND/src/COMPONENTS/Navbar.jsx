import React ,{useEffect,useState}from "react";
import { Link , useNavigate, useLocation} from "react-router-dom";
import "./Navbar.css";
function Navbar(){
  const navigate= useNavigate();
  const location = useLocation();
  const[ isLoggedIn , setIsLggedIn] =useState( !!
  localStorage.getItem("token"));
    useEffect(()=>{
      setIsLggedIn(!!
        localStorage.getItem("token"));
    },[location]);
  const handleLogout=()=>{
    console.log("logout clicked");
    localStorage.removeItem("token");
    navigate("/login");
  };
    return (
      <nav className="navbar">
        <div className="navbar-logo">
            <Link to="/">
            Skill <span> Exchange</span>
            </Link>
        </div>
        <div className="navbar-links">
          {isLoggedIn ?(
            <>
            <Link to = "/dashboard"> Dashboard </Link>
              <Link to = "/profile"> Profile </Link>
              <Link to = "matches"> Matches </Link>
               <Link to = "/requests"> Requests</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>
        ):(
          <>
         <Link to ="/login"> Login </Link>
         <Link to ="/register">Register </Link>
          </>
        )}
        </div>
      </nav>
        
    );
}
export default Navbar;