import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CountdownTimer } from "../../components/CountdownTimer";
import "./ShareAccess.css";

const API = "http://localhost:5000/api";

const Shield  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Lock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Eye     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const Copy    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const Check2  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const Warn    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

export default function ShareAccess() {
  const { token } = useParams();
  const [data, setData]       = useState(null);
  const [locked, setLocked]   = useState(false);
  const [unlockAt, setUnlockAt] = useState(null);
  const [expired, setExpired] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [needsPass, setNeedsPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [show, setShow]       = useState(false);
  const [copied, setCopied]   = useState(false);

  const fetchData = async (pwd) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/share/access/${token}`, { password: pwd });
      setData(res.data); setNeedsPass(false); setPassError("");
    } catch (err) {
      const st  = err.response?.status;
      const msg = err.response?.data?.message || "";
      if (st === 403 && err.response?.data?.locked) { setLocked(true); setUnlockAt(err.response.data.unlockAt); }
      else if (st === 403) { setExpired(true); }
      else if (st === 401) { setNeedsPass(true); if (pwd !== undefined) setPassError("Incorrect password. Try again."); }
      else setError(msg || "Invalid or expired share link.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(undefined); }, []);

  const handleCopy = () => { navigator.clipboard.writeText(data?.content || ""); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="share-page">
      <div className="share-blob share-blob-1" />
      <div className="share-blob share-blob-2" />

      <div className="share-container">
        <div className="share-logo">
          <div className="share-logo-icon"><Shield /></div>
          <h1 className="grad-text">Cloq</h1>
          <p>Secure Shared Item</p>
        </div>

        {loading && (
          <div className="share-card">
            <div className="share-loading">
              <div className="share-spinner"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div>
              <p>Decrypting secure content…</p>
            </div>
          </div>
        )}

        {!loading && locked && (
          <div className="share-card share-card-purple">
            <div className="share-state">
              <div className="share-state-icon locked-icon-wrap"><Lock /></div>
              <h2>Item is Time-Locked</h2>
              <p>This item cannot be viewed until the lock expires.</p>
              <div className="share-timer-box">
                <div className="share-timer-label">Unlocks in:</div>
                <CountdownTimer targetDate={unlockAt} />
                <div className="share-timer-date">on {new Date(unlockAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {!loading && expired && (
          <div className="share-card share-card-warn">
            <div className="share-state">
              <div className="share-state-icon warn-icon-wrap"><Warn /></div>
              <h2>Link Expired</h2>
              <p>This share link has expired and is no longer accessible.</p>
            </div>
          </div>
        )}

        {!loading && error && !needsPass && (
          <div className="share-card share-card-error">
            <div className="share-state">
              <div className="share-state-icon error-icon-wrap"><Warn /></div>
              <h2>Access Denied</h2>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && needsPass && !data && (
          <div className="share-card share-card-blue">
            <div className="share-gate">
              <Lock />
              <h2>Password Protected</h2>
              <p>Enter the password to access this shared item.</p>
            </div>
            {passError && <div style={{ fontSize:12, color:'#fb7185', marginBottom:12 }}>⚠ {passError}</div>}
            <div className="share-field">
              <label>Access Password</label>
              <input className="share-input" type="password" value={password}
                placeholder="Enter password…" onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchData(password)} />
            </div>
            <button className="share-unlock-btn" onClick={() => fetchData(password)}>Unlock</button>
          </div>
        )}

        {!loading && data && (
          <div className="share-success">
            <div className="share-card share-card-blue">
              <div className="share-item-head">
                <div className="share-item-icon"><Shield /></div>
                <div className="share-item-title">
                  <h3>{data.title}</h3>
                  <p>{data.type}</p>
                </div>
              </div>

              <div className="share-content-label">
                Decrypted Content
                <div className="share-content-actions">
                  {data.type === "password" && (
                    <button className="share-small-btn scb-reveal" onClick={() => setShow(!show)}>
                      {show ? <EyeOff /> : <Eye />} {show ? "Hide" : "Show"}
                    </button>
                  )}
                  <button className={`share-small-btn ${copied ? "scb-copied" : "scb-copy"}`} onClick={handleCopy}>
                    {copied ? <Check2 /> : <Copy />} {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className={`share-content-box${data.type === "password" && !show ? " blurred" : ""}`}>
                {data.content}
                {data.type === "password" && !show && (
                  <div className="share-reveal-overlay">
                    <button className="share-reveal-btn" onClick={() => setShow(true)}><Eye /> Reveal</button>
                  </div>
                )}
              </div>
              <div className="share-meta">Shared on: {new Date(data.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="share-footer">
              ⚡ Powered by <span className="grad-text" style={{fontWeight:700}}>Cloq</span> — Secure Digital Vault
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
