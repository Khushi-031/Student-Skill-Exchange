import React, { useState } from "react";
import { Link } from "react-router-dom";
function ExploreSkills() {
  const[students,setStudents]=useState([]);
  const [skill,setSkill] = useState("");

  const handleSearch = async() => {
    if(!skill.trim()){
      return;
    }
    try{
      const token = localStorage.getItem("token");
      console.log("token is:",token);
      const response = await fetch(`http://localhost:3000/students/skill/${skill.trim()}`,
      {
               headers:{
                Authorization:`Bearer ${token}`,
               },
              }
    );
      const data = await response.json();
      setStudents(data);
    }catch(error){
      console.error("error in searching",error);
    }
  };

  const handleSendRequest = async (receiverId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/requests/${receiverId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to send request");
        return;
      }

      alert("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Something went wrong while sending the request");
    }
  };

  

  return (
    <div className="explore-container">
      <h1>Explore Skills</h1>

      <p>Find students who have the skills you are looking for.</p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search for a skill..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />

        <button onClick={handleSearch}>
          Search
        </button>
      </div>
      
      <div className="students-list">
        {students.length===0?(
          <p>No student found!</p>
        ):(
          students.map((student)=>(
            <div className="card" key={student._id}>
              <h3>{student.name}</h3>
              <p><strong>College:</strong>{student.college}</p>
               <p><strong>Smester:</strong>{student.semester}</p>
               <p><strong>Skills known:</strong>{student.skillsKnown.join(",")}</p>
              <Link to ={`/student/${student._id}`}
              className="view-profile-btn"> View Profile </Link>
              <button onClick={()=>
                handleSendRequest(student._id)}>Send Request</button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default ExploreSkills;
