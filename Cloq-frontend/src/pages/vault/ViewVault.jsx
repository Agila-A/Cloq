import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import AppLayout from "../../components/AppLayout";
import { CountdownTimer } from "../../components/CountdownTimer";
import "./ViewVault.css";

/* ── Icons ── */
const Shield    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const FileText  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const Key       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>;
const Lock      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Eye       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const Copy      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const Check2    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const Trash     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const ArrowLeft = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const ExtLink   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const Warn      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

const typeConfig = {
  note:     { icon: FileText, label: "Secure Note",     accentColor: "#8b5cf6", iconColor: "#a78bfa", iconBg: "rgba(139,92,246,.1)", iconBorder: "rgba(139,92,246,.25)", badgeBg: "rgba(139,92,246,.1)", badgeBorder: "rgba(139,92,246,.25)", badgeColor: "#a78bfa" },
  password: { icon: Key,      label: "Password Entry",   accentColor: "#3b82f6", iconColor: "#60a5fa", iconBg: "rgba(59,130,246,.1)",  iconBorder: "rgba(59,130,246,.25)", badgeBg: "rgba(59,130,246,.1)",  badgeBorder: "rgba(59,130,246,.25)", badgeColor: "#60a5fa" },
  file:     { icon: Shield,   label: "File Reference",   accentColor: "#10b981", iconColor: "#34d399", iconBg: "rgba(16,185,129,.1)",  iconBorder: "rgba(16,185,129,.25)", badgeBg: "rgba(16,185,129,.1)",  badgeBorder: "rgba(16,185,129,.25)", badgeColor: "#34d399" },
};

export default function ViewVault() {
  const { id }  = useParams();
  const navigate = useNavigate();
  const [item, setItem]     = useState(null);
  const [locked, setLocked] = useState(false);
  const [unlockAt, setUnlockAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [show, setShow]     = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/vault/${id}`)
      .then(r  => { setItem(r.data); setLocked(false); })
      .catch(err => {
        if (err.response?.status === 403 && err.response.data?.locked) { setLocked(true); setUnlockAt(err.response.data.unlockAt); }
        else setError(err.response?.data?.message || "Failed to load item.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopy = () => { navigator.clipboard.writeText(item?.content || ""); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDelete = async () => {
    if (!confirm("Delete this item permanently?")) return;
    setDeleting(true);
    try { await api.delete(`/vault/${id}`); navigate("/vault"); }
    catch { alert("Failed to delete."); setDeleting(false); }
  };

  if (loading) return (
    <AppLayout>
      <div className="view-page">
        {[0,1,2].map(i => <div key={i} className="shimmer-box" style={{ height: i === 0 ? 120 : 200 }} />)}
      </div>
    </AppLayout>
  );

  if (locked) return (
    <AppLayout>
      <div className="view-locked-page">
        <div className="view-locked-card">
          <div className="view-locked-icon"><Lock /></div>
          <h2>Vault Locked</h2>
          <p>This item is time-locked and cannot be viewed yet.</p>
          <div className="view-locked-timer">
            <div className="timer-label">Unlocks in:</div>
            <CountdownTimer targetDate={unlockAt} onExpire={() => window.location.reload()} />
            <div className="view-locked-date">on {new Date(unlockAt).toLocaleString()}</div>
          </div>
          <button className="view-back" style={{margin:'0 auto'}} onClick={() => navigate("/vault")}><ArrowLeft /> Back to Vault</button>
        </div>
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="view-error-page">
        <div className="view-error-card">
          <Warn /><h2>Error</h2><p>{error}</p>
          <Link to="/vault">← Back to Vault</Link>
        </div>
      </div>
    </AppLayout>
  );

  if (!item) return null;

  const cfg = typeConfig[item.type] || typeConfig.file;
  const Icon = cfg.icon;
  const isPassword = item.type === "password";

  return (
    <AppLayout>
      <div className="view-page">
        <button className="view-back" onClick={() => navigate("/vault")}><ArrowLeft /> Back to Vault</button>

        {/* Header */}
        <div className="view-header-card">
          <div className="view-header-accent" style={{ background: `linear-gradient(90deg,${cfg.accentColor},transparent)` }} />
          <div className="view-header-top">
            <div className="view-icon-wrap" style={{ background: cfg.iconBg, borderColor: cfg.iconBorder, color: cfg.iconColor }}>
              <Icon />
            </div>
            <div className="view-title-group">
              <h1>{item.title}</h1>
              <p>{cfg.label}</p>
            </div>
            <div className="view-type-badge" style={{ background: cfg.badgeBg, borderColor: cfg.badgeBorder, color: cfg.badgeColor }}>
              <Icon /> {cfg.label}
            </div>
          </div>
          <div className="view-meta-row"><Shield /> Stored on {new Date(item.createdAt).toLocaleString()}</div>
        </div>

        {/* Content */}
        <div className="view-content-card">
          <div className="view-content-head">
            <h2>Decrypted Content</h2>
            <div className="view-content-btns">
              {isPassword && (
                <button className="view-small-btn vbtn-reveal" onClick={() => setShow(!show)}>
                  {show ? <EyeOff /> : <Eye />} {show ? "Hide" : "Reveal"}
                </button>
              )}
              <button className={`view-small-btn ${copied ? "vbtn-copied" : "vbtn-copy"}`} onClick={handleCopy}>
                {copied ? <Check2 /> : <Copy />} {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className={`view-content-box${isPassword && !show ? " blurred" : ""}`}>
            {item.content}
            {isPassword && !show && (
              <div className="view-reveal-overlay">
                <button className="view-reveal-btn" onClick={() => setShow(true)}><Eye /> Click to reveal</button>
              </div>
            )}
          </div>

          {item.type === "file" && item.fileUrl && (
            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="view-file-link">
              <ExtLink /> Open file →
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="view-actions">
          <button className="view-back-btn" onClick={() => navigate("/vault")}>← Back</button>
          <button className="view-del-btn" onClick={handleDelete} disabled={deleting}>
            <Trash /> {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
