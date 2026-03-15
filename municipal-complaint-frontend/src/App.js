import React, { useState } from "react";
import bg from "./background.jpg";

function App() {
  const [name, setName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [complaints, setComplaints] = useState([]);

  const submitComplaint = (e) => {
    e.preventDefault();

    const newComplaint = {
      name: name,
      complaint: complaint,
    };

    setComplaints([...complaints, newComplaint]);
    setName("");
    setComplaint("");
  };

  const styles = {
    page: {
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Segoe UI, sans-serif",
    },

    card: {
      background: "#ffffff",
      padding: "40px",
      borderRadius: "14px",
      width: "420px",
      boxShadow: "0 10px 30px rgba(90,60,40,0.25)",
    },

    title: {
      textAlign: "center",
      color: "#5a3e2b",
      marginBottom: "25px",
      letterSpacing: "1px",
    },

    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #d6c4b6",
      outline: "none",
      fontSize: "14px",
      transition: "0.3s",
    },

    textarea: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #d6c4b6",
      minHeight: "90px",
      resize: "none",
      outline: "none",
      fontSize: "14px",
    },

    button: {
      width: "100%",
      padding: "12px",
      marginTop: "15px",
      border: "none",
      borderRadius: "8px",
      background: "#6f4e37",
      color: "white",
      fontSize: "15px",
      cursor: "pointer",
      transition: "0.3s",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },

    complaintBox: {
      marginTop: "25px",
      background: "#f9f6f2",
      padding: "12px",
      borderRadius: "8px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      marginBottom: "10px",
      textAlign: "left",
    },

    name: {
      color: "#6f4e37",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Municipal Complaint System</h1>

        <form onSubmit={submitComplaint}>
          <input
            style={styles.input}
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Enter your complaint"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          />

          <button
            style={styles.button}
            onMouseOver={(e) => (e.target.style.background = "#5a3e2b")}
            onMouseOut={(e) => (e.target.style.background = "#6f4e37")}
          >
            Submit Complaint
          </button>
        </form>

        {complaints.length > 0 && (
          <>
            <h3 style={{ marginTop: "30px", color: "#5a3e2b" }}>
              Submitted Complaints
            </h3>

            {complaints.map((c, index) => (
              <div key={index} style={styles.complaintBox}>
                <span style={styles.name}>{c.name}</span>
                <p>{c.complaint}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
