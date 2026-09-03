import "./Requests.css";
import { useEffect, useState } from "react";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Requests:",JSON.stringify(data,null,2));

      setRequests(data);
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
  try {
    const response = await fetch(
      `http://localhost:3000/requests/${requestId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update request");
      return;
    }

    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request._id === requestId
          ? { ...request, status: status }
          : request
      )
    );

    alert(`Request ${status} successfully!`);

  } catch (error) {
    console.error("Error updating request:", error);
    alert("Something went wrong");
  }
};


  return (
  <div className="requests-container">
    <div className="requests-header">
      <h1>Requests</h1>
      <p>Manage your skill exchange requests.</p>
    </div>

    {requests.length === 0 ? (
      <div className="no-requests">
        <p>No requests yet.</p>
      </div>
    ) : (
      <div className="requests-list">
        {requests.map((request) => (
          <div className="request-card" key={request._id}>
            <h2>{request.sender?.name}</h2>

            <p>
              <strong>Email:</strong> {request.sender?.email}
            </p>

            <p>
              <strong>College:</strong> {request.sender?.college}
            </p>

            <p>
              <strong>Semester:</strong> {request.sender?.semester}
            </p>

            <p>
              <strong>Status:</strong> {request.status}
            </p>

            <div className="request-actions">
              <button className="accept-btn" onClick={()=>
                handleStatusUpdate(request._id,"accepted")
              }>
                Accept
              </button>

              <button className="reject-btn" onClick={()=>
                handleStatusUpdate(request._id,"rejected")
              }>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

}

export default Requests;
