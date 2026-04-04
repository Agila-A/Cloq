import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
function SpinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'spin .8s linear infinite'}}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}

export default function Signup() {
  const [formData, setFormData] = useState({ email: "", masterPassword: "", confirm: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getStrength = () => {
    const p = formData.masterPassword;
    if (!p) return "";
    if (p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p)) return "strong";
    if (p.length >= 6) return "medium";
    return "weak";
  };
  const strength = getStrength();

  const handleSignup = async (e) => {
    e.preventDefault(); setError("");
    if (formData.masterPassword !== formData.confirm) { setError("Passwords do not match."); return; }
    if (formData.masterPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const cred  = await createUserWithEmailAndPassword(auth, formData.email, formData.masterPassword);
      const token = await cred.user.getIdToken();
      localStorage.setItem("firebaseToken", token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, "").trim());
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGLoading(true); setError("");
    try {
      const cred  = await signInWithPopup(auth, new GoogleAuthProvider());
      const token = await cred.user.getIdToken();
      localStorage.setItem("firebaseToken", token);
      navigate("/dashboard");
    } catch { setError("Google sign-in failed."); }
    finally { setGLoading(false); }
  };

  const passwordsMatch = formData.confirm && formData.confirm === formData.masterPassword;

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" style={{ background: 'radial-gradient(circle,#7c3aed22,transparent)', top: '15%', right: '15%', left: 'auto' }} />
      <div className="auth-blob auth-blob-2" style={{ background: 'radial-gradient(circle,#2563eb22,transparent)', bottom: '15%', left: '15%', right: 'auto' }} />

      <div className="auth-wrapper">
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', boxShadow: '0 0 32px rgba(124,58,237,.45)' }}>
            <ShieldIcon />
          </div>
          <h1 className="grad-text">Cloq</h1>
          <p>Create your secure vault</p>
        </div>

        <div className="glass auth-card">
          <h2>Create your account</h2>

          {error && <div className="auth-alert"><AlertIcon />{error}</div>}

          <form className="auth-form" onSubmit={handleSignup}>
            <div className="auth-field">
              <label>Email</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><MailIcon /></span>
                <input className="auth-input" type="email" name="email"
                  placeholder="you@example.com" onChange={handleChange} required />
              </div>
            </div>

            <div className="auth-field">
              <label>Master Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><LockIcon /></span>
                <input className="auth-input" type="password" name="masterPassword"
                  placeholder="••••••••••" onChange={handleChange} required />
              </div>
              {strength && (
                <div className="strength-bar">
                  <div className="strength-dots">
                    <div className={`strength-dot ${strength === "weak" || strength === "medium" || strength === "strong" ? strength : ""}`} />
                    <div className={`strength-dot ${strength === "medium" || strength === "strong" ? strength : ""}`} />
                    <div className={`strength-dot ${strength === "strong" ? strength : ""}`} />
                  </div>
                  <span className={`strength-label ${strength}`}>{strength}</span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><LockIcon /></span>
                {passwordsMatch && <span className="auth-input-icon-right" style={{ color: '#10b981' }}><CheckIcon /></span>}
                <input className="auth-input" type="password" name="confirm"
                  placeholder="••••••••••" onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn-primary btn-purple" disabled={loading}>
              {loading ? <SpinIcon /> : <ShieldIcon />}
              {loading ? "Creating vault…" : "Create Vault"}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span>or continue with</span>
            <div className="auth-divider-line" />
          </div>

          <button className="btn-google" onClick={handleGoogle} disabled={gLoading}>
            {gLoading ? <SpinIcon /> : <GoogleIcon />}
            {gLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/auth/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
