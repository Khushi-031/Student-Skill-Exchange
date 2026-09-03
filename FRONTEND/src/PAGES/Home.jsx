import { Link } from "react-router-dom";
import "./Home.css";
function Home(){
  const token =localStorage.getItem("token");
  console.log("token");
  return (
    <div className="home-container">
    <div className="home-content">
        <h1>Student Skill Exchange</h1>
        <p>Connect,Learn and Exchange skills with other students</p>
        <Link to ="/explore-skills" className="home-btn">Explore Skills</Link>
    </div>
    </div>
  )
}
export default Home