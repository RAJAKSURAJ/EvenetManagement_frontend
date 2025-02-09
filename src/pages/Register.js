import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(BASE_URL + "auth/register", {
        name,
        email,
        password,
        role,
      });
      toast.success("Registered successfully! Please Login");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Registration failed");
    }
  };

  return (
    <>
      <Toaster />
      <div className="container mt-5 col-5">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="form-control mb-2"
            onChange={(e) => setName(e.target.value)}
            required
          />
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

          <label>Select Role:</label>
          <select
            className="form-control mb-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button className="btn btn-primary">Register</button>
        </form>
      </div>
    </>
  );
}

export default Register;
