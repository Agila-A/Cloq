import { useState } from "react";
import axios from "axios";
import "./signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    masterPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );

      setMessage(res.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="masterPassword"
          placeholder="Master Password"
          onChange={handleChange}
          required
        />

        <button>Sign Up</button>

        {message && <p className="msg">{message}</p>}
      </form>
    </div>
  );
}
