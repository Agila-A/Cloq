import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import AppLayout from "../../components/AppLayout";
import { CountdownTimer } from "../../components/CountdownTimer";
import "./VaultList.css";

/* ── Icons ── */
const Shield    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const FileText  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const Key       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>;
const Lock      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Unlock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>;
const Eye       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const Share2    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const Trash     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const Search    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const Filter    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const Plus      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Warn      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

const typeConfig = {
  note:     { icon: FileText, accentColor: "#8b5cf6", iconClass: "icon-purple", borderColor: "rgba(139,92,246,.25)" },
  password: { icon: Key,      accentColor: "#3b82f6", iconClass: "icon-blue",   borderColor: "rgba(59,130,246,.25)" },
  file:     { icon: Shield,   accentColor: "#10b981", iconClass: "icon-emerald", borderColor: "rgba(16,185,129,.25)" },
};

function ShareModal({ item, onClose }) {
  const [hours, setHours]   = useState(24);
  const [pass, setPass]     = useState("");
  const [link, setLink]     = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.post("/share/generate", { vaultItemId: item._id, expiresInHours: hours, password: pass || undefined });
      setLink(`${window.location.origin}/share/${res.data.token}`);
    } catch { alert("Failed to generate share link."); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="modal-overlay">
      <div className="modal-bg" onClick={onClose} />
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2><Share2 /> Share: {item.title}</h2>
        <p>Generate a secure time-limited share link.</p>

        <div className="modal-field">
          <label>Expires in (hours)</label>
          <input className="modal-input" type="number" min={1} max={720} value={hours} onChange={e => setHours(+e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Password (optional)</label>
          <input className="modal-input" type="password" value={pass} placeholder="Leave blank for no password" onChange={e => setPass(e.target.value)} />
        </div>

        {link ? (
          <div className="modal-link-box">
            <p>✅ Link Generated!</p>
            <div className="modal-link-row">
              <span>{link}</span>
              <button className={`modal-copy-btn ${copied ? "copied" : "default"}`} onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
            </div>
          </div>
        ) : (
          <button className="modal-gen-btn" onClick={generate} disabled={loading}>
            <Share2 /> {loading ? "Generating…" : "Generate Link"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function VaultList() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [shareItem, setShareItem] = useState(null);
  const [deleting, setDeleting]   = useState(null);

  useEffect(() => {
    api.get("/vault")
      .then(r => setItems(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try { await api.delete(`/vault/${id}`); setItems(p => p.filter(i => i._id !== id)); }
    catch { alert("Failed to delete item."); }
    finally { setDeleting(null); }
  };

  const filtered = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const isLocked    = item.isLocked && item.unlockAt && new Date(item.unlockAt) > new Date();
    const matchFilter = filter === "all" ? true : filter === "locked" ? isLocked : item.type === filter;
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="vault-page">
          {[0,1,2,3].map(i => <div key={i} className="shimmer-box" style={{height: 140}} />)}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="vault-page">
        {/* Header */}
        <div className="vault-header">
          <div>
            <h1><Shield /> My Vault</h1>
            <p>{items.length} encrypted item{items.length !== 1 ? "s" : ""}</p>
          </div>
          <Link to="/vault/create" className="vault-add-btn"><Plus /> Add Item</Link>
        </div>

        {/* Controls */}
        <div className="vault-controls">
          <div className="vault-search-wrap">
            <span className="vault-search-icon"><Search /></span>
            <input className="vault-search" placeholder="Search vault…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="vault-filter-wrap">
            <span className="vault-filter-icon"><Filter /></span>
            <select className="vault-filter" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="note">Notes</option>
              <option value="password">Passwords</option>
              <option value="file">Files</option>
              <option value="locked">🔒 Locked</option>
            </select>
          </div>
        </div>

        {/* Items */}
        {filtered.length === 0 ? (
          <div className="vault-empty">
            <Shield />
            <h3>{search || filter !== "all" ? "No items match your filters" : "Your vault is empty"}</h3>
            <p>{search || filter !== "all" ? "Try clearing your search or filter." : "Start adding encrypted items to keep them safe."}</p>
            {!search && filter === "all" && <Link to="/vault/create"><Plus /> Add First Item</Link>}
          </div>
        ) : (
          <div className="vault-grid">
            {filtered.map((item, idx) => {
              const cfg = typeConfig[item.type] || typeConfig.file;
              const Icon = cfg.icon;
              const isLocked = item.isLocked && item.unlockAt && new Date(item.unlockAt) > new Date();
              return (
                <div key={item._id} className="vault-card" style={{ animationDelay: `${idx * 55}ms`, borderColor: isLocked ? "rgba(244,63,94,.2)" : undefined }}>
                  {/* Top accent line */}
                  <div className="vault-card-accent" style={{ background: `linear-gradient(90deg, ${cfg.accentColor}, transparent)` }} />

                  <div className="vault-card-top">
                    <div className={`vault-type-icon ${cfg.iconClass}`} style={{ borderColor: cfg.borderColor }}><Icon /></div>
                    <div className="vault-card-meta">
                      <h3>{item.title}</h3>
                      <p>{item.type === "note" ? "Secure Note" : item.type === "password" ? "Password Entry" : "File"}</p>
                    </div>
                    <div className={`lock-badge ${isLocked ? "lock-badge-locked" : "lock-badge-unlocked"}`}>
                      {isLocked ? <Lock /> : <Unlock />}
                    </div>
                  </div>

                  {isLocked && (
                    <div className="vault-lock-bar">
                      <div className="vault-lock-label"><Warn /> Time-Locked — Unlocks in</div>
                      <CountdownTimer targetDate={item.unlockAt} />
                    </div>
                  )}

                  <div className="vault-card-actions">
                    <Link to={`/vault/${item._id}`} className="vault-action-btn btn-view"><Eye /> View</Link>
                    <button className="vault-action-btn btn-share" onClick={() => setShareItem(item)}><Share2 /> Share</button>
                    <button className="vault-action-btn btn-delete" onClick={() => handleDelete(item._id, item.title)} disabled={deleting === item._id}>
                      <Trash /> {deleting === item._id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {shareItem && <ShareModal item={shareItem} onClose={() => setShareItem(null)} />}
    </AppLayout>
  );
}
