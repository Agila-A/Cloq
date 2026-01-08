import "./dashboard.css";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("firebaseToken");
    navigate("/auth/login");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h1>CLOQ</h1>
        <p className="subtitle">Your secure password vault</p>

        <div className="actions">
          <button onClick={() => alert("Add Password – next step")}>
            ➕ Add Password
          </button>

          <button onClick={() => alert("View Vault – next step")}>
            🔐 View Vault
          </button>

          <button className="logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
