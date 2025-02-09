import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      toast.success("Logged in successfully");
      navigate("/events");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <>
      <Toaster />
      <div className="container mt-5 col-5">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-2"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-2"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    </>
  );
}

export default Login;
