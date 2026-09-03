import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./StudentProfile.css";

function StudentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/students/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            console.log("student data", data);
            setStudent(data);
        };

        fetchStudent();
    }, [id]);

    if (!student) {
        return <h2 className="profile-loading">Loading profile...</h2>;
    }

    return (
        <div className="student-profile-page">

            <div className="student-profile-card">

                <div className="student-profile-header">
                    <div className="profile-avatar">
                        {student.name?.charAt(0).toUpperCase()}
                    </div>

                    <h1>{student.name}</h1>
                    <p>Student Profile</p>
                </div>

                <div className="student-info">

                    <div className="info-row">
                        <span className="info-label">Email</span>
                        <span>{student.email}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Phone</span>
                        <span>{student.phone}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">College</span>
                        <span>{student.college}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Semester</span>
                        <span>{student.semester}</span>
                    </div>

                </div>

                <div className="skills-section">
                    <h3>Skills I Know</h3>

                    <div className="skill-tags">
                        {Array.isArray(student.skillsKnown)
                            ? student.skillsKnown.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                </span>
                            ))
                            : <span className="skill-tag">{student.skillsKnown}</span>
                        }
                    </div>
                </div>

                <div className="skills-section">
                    <h3>Skills I Want to Learn</h3>

                    <div className="skill-tags wanted">
                        {Array.isArray(student.skillsWanted)
                            ? student.skillsWanted.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                </span>
                            ))
                            : <span className="skill-tag">{student.skillsWanted}</span>
                        }
                    </div>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/matches")}
                >
                    ← Back to Matches
                </button>

            </div>
        </div>
    );
}

export default StudentProfile;
