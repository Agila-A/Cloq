import { useEffect, useState } from "react";
import { useAuthState } from "../../hooks/useAuthState";
import api from "../../utils/api";
import AppLayout from "../../components/AppLayout";
import "./Profile.css";

/* ── Icons ── */
const User     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Mail     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>;
const Calendar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const Shield   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Activity = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const Clock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const FileText = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const Key      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>;
const Check    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const ShareIcon= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const Trash    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;

const actionMeta = {
  CREATE_VAULT: { dot: "led-emerald", chip: "chip-emerald", label: "Created"  },
  VIEW_VAULT:   { dot: "led-blue",    chip: "chip-blue",    label: "Viewed"   },
  SHARE_LINK:   { dot: "led-purple",  chip: "chip-purple",  label: "Shared"   },
  DELETE_VAULT: { dot: "led-rose",    chip: "chip-rose",    label: "Deleted"  },
  LOGIN:        { dot: "led-slate",   chip: "chip-slate",   label: "Login"    },
};

const statConfig = [
  { key: "CREATE_VAULT", icon: Shield,   label: "Created",  iconClass: "icon-emerald" },
  { key: "VIEW_VAULT",   icon: Key,      label: "Viewed",   iconClass: "icon-blue"    },
  { key: "SHARE_LINK",   icon: ShareIcon,label: "Shared",   iconClass: "icon-purple"  },
  { key: "DELETE_VAULT", icon: Trash,    label: "Deleted",  iconClass: "icon-rose"    },
];

export default function Profile() {
  const { user }  = useAuthState();
  const [logs, setLogs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/logs")
      .then(r => setLogs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const counts = logs.reduce((acc, l) => { acc[l.action] = (acc[l.action] || 0) + 1; return acc; }, {});
  const displayName = user?.displayName || "Vault User";
  const initial     = (user?.displayName?.[0] || user?.email?.[0] || "?").toUpperCase();
  const joinDate    = user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "—";

  return (
    <AppLayout>
      <div className="profile-page">
        <div className="profile-header">
          <h1>Profile &amp; Security</h1>
          <p>Your account information and vault activity.</p>
        </div>

        {/* Hero */}
        <div className="profile-hero">
          <div className="profile-hero-accent" />
          <div className="profile-avatar">{initial}</div>
          <div className="profile-info">
            <h2>{displayName}</h2>
            <div className="profile-info-row">
              <span><Mail className="prof-email-icon" style={{display:'inline-block',width:14,height:14,color:'#60a5fa'}} />{user?.email}</span>
              <span><Calendar style={{display:'inline-block',width:14,height:14,color:'#a78bfa'}} /> Joined {joinDate}</span>
            </div>
            <div className="profile-badges">
              <span className="profile-badge pb-green">
                <svg className="pb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Email Verified
              </span>
              <span className="profile-badge pb-blue">
                <svg className="pb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                AES-256 Protected
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          {statConfig.map(({ key, icon: Icon, label, iconClass }) => (
            <div key={key} className="ps-card">
              <div className={`ps-icon ${iconClass}`}><Icon /></div>
              <div className="ps-val">{counts[key] || 0}</div>
              <div className="ps-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Activity log */}
        <div className="profile-log-panel">
          <div className="profile-log-head">
            <h2><Clock /> Full Activity Log</h2>
            <span>{logs.length} events</span>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[0,1,2,3,4].map(i => <div key={i} className="shimmer-box" style={{ height: 52 }} />)}
            </div>
          ) : logs.length === 0 ? (
            <div className="log-empty">
              <Activity />
              <p>No activity recorded yet.</p>
            </div>
          ) : (
            <div className="log-timeline">
              <div className="log-timeline-line" />
              <div className="log-entries">
                {logs.map(log => {
                  const m = actionMeta[log.action] || { dot: "led-slate", chip: "chip-slate", label: log.action };
                  return (
                    <div key={log._id} className="log-entry">
                      <div className={`log-entry-dot ${m.dot}`} />
                      <div className="log-entry-body">
                        <div className="log-entry-top">
                          <p className="log-entry-text">{log.details || m.label}</p>
                          <span className={`log-entry-chip ${m.chip}`}>{m.label}</span>
                        </div>
                        <div className="log-entry-time">{new Date(log.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
