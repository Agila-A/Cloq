import "./landingPage.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1>CLOQ</h1>
        <p>Your secure vault for passwords.</p>

        <div className="landing-buttons">
          <Link to="/auth/login">
            <button className="login-btn">Login</button>
          </Link>

          <Link to="/auth/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
