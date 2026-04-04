import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import AppLayout from "../../components/AppLayout";
import "./CreateVault.css";

/* ── Icons ── */
const FileText = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const Key      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>;
const Shield   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Lock     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Plus     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Calendar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const AlertIcon= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const WarnIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const CheckIcon= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>;

const typeOptions = [
  { value: "note",     icon: FileText, label: "Secure Note",   desc: "Store private text or notes" },
  { value: "password", icon: Key,      label: "Password",       desc: "Save credentials or keys"    },
  { value: "file",     icon: Shield,   label: "File Reference", desc: "Link to an encrypted file"   },
];

const sensitiveKeywords = ["password","secret","api key","token","ssn","social security","credit card","cvv","pin","passport","bank","routing","otp","private key","seed phrase"];
const detectSensitivity  = (text) => sensitiveKeywords.some(kw => text.toLowerCase().includes(kw));

export default function CreateVault() {
  const navigate = useNavigate();
  const [type, setType]         = useState("note");
  const [title, setTitle]       = useState("");
  const [content, setContent]   = useState("");
  const [fileUrl, setFileUrl]   = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [unlockAt, setUnlockAt] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [aiWarn, setAiWarn]     = useState(false);

  const SelectedIcon = typeOptions.find(t => t.value === type)?.icon || Shield;

  const handleContent = (val) => { setContent(val); setAiWarn(detectSensitivity(val)); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!title.trim() || !content.trim()) { setError("Title and content are required."); return; }
    if (isLocked && !unlockAt) { setError("Please set an unlock date/time."); return; }

    // Convert local datetime string to UTC ISO string for backend comparison
    const unlockDate = isLocked ? new Date(unlockAt) : null;
    if (isLocked && unlockDate && unlockDate <= new Date()) {
      setError("Unlock time must be in the future."); return;
    }

    setLoading(true);
    try {
      await api.post("/vault/add", {
        title: title.trim(),
        type,
        content: content.trim(),
        fileUrl: type === "file" ? fileUrl : undefined,
        isLocked,
        unlockAt: isLocked && unlockDate ? unlockDate.toISOString() : undefined,
      });
      navigate("/vault");
    } catch (err) { setError(err.response?.data?.message || "Failed to save item."); }
    finally { setLoading(false); }
  };

  const minDate = new Date(Date.now() + 60000).toISOString().slice(0,16);

  return (
    <AppLayout>
      <div className="create-page">
        <div className="create-header">
          <h1><Plus /> Add Vault Item</h1>
          <p>All data is AES-256-CBC encrypted before storage.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type */}
          <div className="create-panel">
            <h3>Item Type</h3>
            <div className="type-grid">
              {typeOptions.map(({ value, icon: Icon, label, desc }) => (
                <button key={value} type="button" onClick={() => setType(value)}
                  className={`type-btn${type === value ? " active" : ""}`}>
                  <Icon />
                  <span>{label}</span>
                  <small>{desc}</small>
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="create-panel" style={{ marginTop: 16 }}>
            <div className="create-field">
              <label className="create-label">Title</label>
              <div className="create-input-wrap">
                <span className="create-input-icon"><SelectedIcon /></span>
                <input className="create-input" type="text" value={title}
                  placeholder={type === "password" ? "e.g. Gmail Password" : type === "file" ? "e.g. Tax Document 2024" : "e.g. Emergency Contacts"}
                  onChange={e => setTitle(e.target.value)} required />
              </div>
            </div>

            <div className="create-field">
              <label className="create-label">
                {type === "note" ? "Note Content" : type === "password" ? "Password / Credentials" : "File Reference / URL"}
              </label>
              <textarea className="create-textarea" rows={6} value={content}
                placeholder={type === "note" ? "Write your secure note here…" : type === "password" ? "site: example.com\nusername: you@email.com\npassword: ••••••••" : "https://drive.google.com/…"}
                onChange={e => handleContent(e.target.value)} required />
              {aiWarn && (
                <div className="ai-warning">
                  <WarnIcon /> ⚠️ Sensitive data detected — will be encrypted before storage.
                </div>
              )}
            </div>

            {type === "file" && (
              <div className="create-field">
                <label className="create-label">File URL</label>
                <input className="create-input create-input-no-icon" type="url" value={fileUrl}
                  placeholder="https://…" onChange={e => setFileUrl(e.target.value)} />
              </div>
            )}
          </div>

          {/* Time-lock */}
          <div className="create-panel" style={{ marginTop: 16 }}>
            <div className="lock-row">
              <div className="lock-info">
                <h4><Lock /> Time-Lock This Item</h4>
                <p>Prevent access until a future date and time</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isLocked}
                  onChange={e => setIsLocked(e.target.checked)}
                />
                <span className="toggle-track" />
              </label>
            </div>

            {isLocked && (
              <div className="lock-datetime-wrap">
                <div className="create-field" style={{ marginBottom: 0 }}>
                  <label className="create-label">Unlock At</label>
                  <div className="create-input-wrap">
                    <span className="create-input-icon"><Calendar /></span>
                    <input
                      className="create-input"
                      type="datetime-local"
                      value={unlockAt}
                      min={minDate}
                      onChange={e => setUnlockAt(e.target.value)}
                    />
                  </div>
                  {unlockAt && (
                    <div className="lock-hint">
                      <CheckIcon /> Will unlock on{" "}
                      {new Date(unlockAt).toLocaleString(undefined, {
                        weekday: "short", year: "numeric", month: "short",
                        day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="create-error" style={{ marginTop: 16 }}><AlertIcon /> {error}</div>
          )}

          <div className="create-form-actions" style={{ marginTop: 20 }}>
            <button type="button" className="btn-cancel" onClick={() => navigate("/vault")}>Cancel</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Encrypting & Saving…" : <><Shield /> Save to Vault</>}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
