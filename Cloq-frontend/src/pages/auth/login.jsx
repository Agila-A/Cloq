import { useState } from "react";
import axios from "axios";
import "./login.css";

export default function Login() {
  const [formData, setFormData] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
    } catch (error) {
      console.error(error);
      setMessage("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Login</h2>

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

        <button>Login</button>

        {message && <p className="msg">{message}</p>}
      </form>
    </div>
  );
}
