import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Matches.css";

function Matches() {
    const navigate = useNavigate();

    const [matches, setMatches] = useState([]);
    const [requestStatus, setRequestStatus] = useState({});

    useEffect(() => {
        const fetchMatches = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3000/matches/perfect",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log("Perfect matches", data);

            setMatches(data);
        };

        fetchMatches();
    }, []);

    const sendRequest = async (receiverId) => {
        const token = localStorage.getItem("token");

        try {
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

            console.log("Send request response:", data);

            if (response.ok) {
                // Request successfully sent
                setRequestStatus((previous) => ({
                    ...previous,
                    [receiverId]: "sent",
                }));
            } else if (
                response.status === 400 &&
                data.message === "request already exist"
            ) {
                // Duplicate request
                setRequestStatus((previous) => ({
                    ...previous,
                    [receiverId]: "already",
                }));
            } else {
                setRequestStatus((previous) => ({
                    ...previous,
                    [receiverId]: "error",
                }));
            }
        } catch (error) {
            console.error("Request error:", error);

            setRequestStatus((previous) => ({
                ...previous,
                [receiverId]: "error",
            }));
        }
    };

    return (
    <div className="matches-page">

        <h1 className="matches-title">
            Perfect Matches
        </h1>

        <p className="matches-subtitle">
            Students who match your skills and learning goals
        </p>

        {matches.length === 0 ? (
            <p className="no-match">
                No perfect match found
            </p>
        ) : (
            <div className="matches-container">

                {matches.map((student) => (

                    <div className="match-card" key={student._id}>

                        <h3 className="match-name">
                            {student.name}
                        </h3>

                        <p className="match-info">
                            <strong>Email:</strong>{" "}
                            {student.email}
                        </p>

                        <p className="match-info">
                            <strong>Phone:</strong>{" "}
                            {student.phone}
                        </p>

                        <p className="match-info">
                            <strong>College:</strong>{" "}
                            {student.college}
                        </p>

                        <div className="match-buttons">

                            <button
                                className="view-profile-btn"
                                onClick={() =>
                                    navigate(
                                        `/student/${student._id}`
                                    )
                                }
                            >
                                View Profile
                            </button>

                            <button
                                className="send-request-btn"
                                onClick={() =>
                                    sendRequest(student._id)
                                }
                                disabled={
                                    requestStatus[student._id] ===
                                        "sent" ||
                                    requestStatus[student._id] ===
                                        "already"
                                }
                            >
                                {requestStatus[student._id] ===
                                "sent"
                                    ? "Request Sent ✓"
                                    : requestStatus[student._id] ===
                                      "already"
                                    ? "Request Already Sent"
                                    : "Send Request"}
                            </button>

                        </div>

                        {requestStatus[student._id] ===
                            "error" && (
                            <p className="request-error">
                                Something went wrong. Please try
                                again.
                            </p>
                        )}

                    </div>

                ))}

            </div>
        )}

    </div>
);

}

export default Matches;
