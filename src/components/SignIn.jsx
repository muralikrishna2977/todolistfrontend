import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignIn.scss";

function SignIn() {
  const [emailid, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation


  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = { emailid, password };

    try {
      const response = await axios.post("/signin", formData);
      if(response.data.message=="Login successful")
      {
        // navigate("/home");
        const userData={
          id: response.data.user,
          // tasks: response.data.tasks,
        }
        //console.log(userData);
        // navigate("/home", { state: userData });
        navigate("/home", { state: { user: userData } });


      }
    } catch (err) {
      // setError(err.response?.data?.message || "An error occurred");
      console.log(err);
      setError(err.response?.data?.message || "An error occurred"); // Store error message
    }
  }

  return (
    <div className="signin">
      <h2>Sign In</h2>
      <form className="signinform" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" name="emailid" value={emailid} onChange={handleEmail} />
        <input type="password" placeholder="Password" name="password" value={password} onChange={handlePassword} />
        <button type="submit">Sign In</button>
      </form>
      <div className="signinmessage">
      {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default SignIn;


