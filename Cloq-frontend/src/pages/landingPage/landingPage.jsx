import { Link } from "react-router-dom";
import "./landingPage.css";

const Shield  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Lock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Clock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Share2  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const ArrowRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

const features = [
  {
    icon: Shield, label: "AES-256 Encryption",
    desc: "Every piece of data is encrypted with military-grade AES-256-CBC before being stored. Only you can decrypt it.",
    bg: "linear-gradient(135deg,#2563eb,#3b82f6)",
  },
  {
    icon: Clock, label: "Time-Lock Vault",
    desc: "Set a future unlock date on any item. Content is completely inaccessible until the countdown reaches zero.",
    bg: "linear-gradient(135deg,#7c3aed,#8b5cf6)",
  },
  {
    icon: Share2, label: "Secure Sharing",
    desc: "Generate time-limited, optionally password-protected share links. Links auto-expire and leave no trace.",
    bg: "linear-gradient(135deg,#059669,#10b981)",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Blobs */}
      <div className="landing-blob lb-1" />
      <div className="landing-blob lb-2" />
      <div className="landing-blob lb-3" />

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-logo-icon"><Shield /></div>
          <span className="grad-text">Cloq</span>
        </div>
        <div className="landing-nav-links">
          <Link to="/auth/login" className="landing-login-btn">Sign In</Link>
          <Link to="/auth/signup" className="landing-signup-btn">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-pill">
          <div className="landing-pill-dot" />
          Privacy-first Digital Vault
          <Lock />
        </div>

        <h1>
          <span>Your secrets,</span>
          <span className="grad-text">always protected.</span>
        </h1>

        <p>
          Store passwords, notes, and files with end-to-end AES-256 encryption.
          Lock items with a time delay. Share securely — with full control.
        </p>

        <div className="landing-ctas">
          <Link to="/auth/signup" className="landing-cta-primary">
            <Shield /> Start for Free <ArrowRight />
          </Link>
          <Link to="/auth/login" className="landing-cta-secondary">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        {features.map(({ icon: Icon, label, desc, bg }) => (
          <div key={label} className="feature-card">
            <div className="feature-icon" style={{ background: bg, boxShadow: `0 0 20px ${bg.includes('2563eb') ? 'rgba(37,99,235,.3)' : bg.includes('7c3aed') ? 'rgba(124,58,237,.3)' : 'rgba(5,150,105,.3)'}` }}>
              <Icon />
            </div>
            <h3>{label}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
