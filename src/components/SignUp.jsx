import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.scss";

function SignUp() {
    const [name, setName] = useState(""); 
  const [emailid, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); // Store server response message
  const [error, setError] = useState(""); // Store errors
  const navigate = useNavigate(); // Hook for navigation


  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formData = { name, emailid, password };

    try {
      const response = await axios.post("/signup", formData);
      setMessage(response.data.message); // Store success message
      setError(""); // Clear errors if successful
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred"); // Store error message
      setMessage(""); // Clear success message if error
    }
  }

  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form  className="signupform" onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={emailid} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <div className="signinup">
        <p>Already have an account?</p>
        <button onClick={() => navigate("/signin")}>Sign In</button>
      </div>
      <div className="signupmessage">
          {message && <p style={{ color: "#10a37f" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default SignUp;
