import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    masterPassword: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.masterPassword
      );

      navigate("/dashboard"); // ✅ redirect
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSignup}>
        <h2>Create Account</h2>

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
