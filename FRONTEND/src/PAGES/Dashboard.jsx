import "./Dashboard.css";
import { useEffect, useState } from "react";
function Dashboard(){
    const [user , setUser]= useState(null);
    useEffect(()=>{
        const fetchProfile = async()=>{
            const token = localStorage.getItem("token");
            const response = await
            fetch("http://localhost:3000/profile",{
                method:"GET",
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log("dashboard user:",data);
            setUser(data);
        };
        fetchProfile();
    },[]);
    return (
  <div className="dashboard-container">
    <div className="dashboard-header">
      <h1>Student Skill Exchange</h1>
      <p>Your personal learning and skill-sharing dashboard</p>
    </div>

    {user ? (
      <>
        <div className="welcome-card">
          <h2>Welcome, {user.name} 👋</h2>
          <p>{user.email}</p>
        </div>

        <div className="skills-section">
          <div className="skill-card">
            <h3>My Skills</h3>

            <div className="skills-list">
              {user.skillsKnown?.map((skill, index) => (
                <span className="skill-tag" key={index}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="skill-card">
            <h3>Skills I Want to Learn</h3>

            <div className="skills-list">
              {user.skillsWanted?.map((skill, index) => (
                <span className="skill-tag wanted" key={index}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </>
    ) : (
      <p className="loading-text">Loading profile...</p>
    )}
  </div>
);

}
export default Dashboard;