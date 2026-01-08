import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.masterPassword
      );

      const token = await userCredential.user.getIdToken();
      localStorage.setItem("firebaseToken", token);

      navigate("/dashboard"); // ✅ redirect
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
