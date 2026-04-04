import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuthState } from "../../hooks/useAuthState";
import AppLayout from "../../components/AppLayout";
import "./dashboard.css";

/* ── Icons ── */
const Shield   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Lock     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Activity = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const Trend    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const Plus     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
const Eye      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const Clock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ArrowRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const FileText = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const Key      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>;

const typeIcon  = { note: FileText, password: Key, file: Shield };
const typeClass = { note: "icon-purple", password: "icon-blue", file: "icon-emerald" };

const actionMeta = {
  CREATE_VAULT: { dot: "dot-emerald", bg: "bg-emerald" },
  VIEW_VAULT:   { dot: "dot-blue",    bg: "bg-blue"    },
  SHARE_LINK:   { dot: "dot-purple",  bg: "bg-purple"  },
  DELETE_VAULT: { dot: "dot-rose",    bg: "bg-rose"    },
  LOGIN:        { dot: "dot-slate",   bg: "bg-slate"   },
};

export default function Dashboard() {
  const { user }    = useAuthState();
  const [items, setItems]   = useState([]);
  const [logs, setLogs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/vault"), api.get("/logs")])
      .then(([vr, lr]) => { setItems(vr.data); setLogs(lr.data.slice(0, 5)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total  = items.length;
  const locked = items.filter(i => i.isLocked && i.unlockAt && new Date(i.unlockAt) > new Date()).length;
  const recent = items.slice(0, 5);

  const name = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  if (loading) {
    return (
      <AppLayout>
        <div className="dash-page">
          <div className="dash-stats">
            {[0,1,2].map(i => <div key={i} className="shimmer-box" style={{height:120}} />)}
          </div>
          <div className="dash-actions">
            {[0,1,2].map(i => <div key={i} className="shimmer-box" style={{height:80}} />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="dash-page">
        {/* Header */}
        <div className="dash-header anim-up">
          <h1>Welcome back, <span className="grad-text">{name}</span> 👋</h1>
          <p>Here's an overview of your secure vault.</p>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {[
            { icon: Shield,   label: "Total vault items", value: total,       bg: "linear-gradient(135deg,#2563eb,#3b82f6)", delay: "0ms"   },
            { icon: Lock,     label: "Time-locked items",  value: locked,      bg: "linear-gradient(135deg,#e11d48,#f43f5e)", delay: "100ms" },
            { icon: Activity, label: "Recent activities",  value: logs.length, bg: "linear-gradient(135deg,#7c3aed,#8b5cf6)", delay: "200ms" },
          ].map(({ icon: Icon, label, value, bg, delay }) => (
            <div className="stat-card" key={label} style={{ animationDelay: delay }}>
              <div className="stat-card-top">
                <div className="stat-icon" style={{ background: bg }}><Icon /></div>
                <div className="stat-trend"><Trend /></div>
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="dash-actions">
          {[
            { to: "/vault/create", icon: Plus,     label: "Add New Item",  desc: "Store a note, password or file", bg: "linear-gradient(135deg,#2563eb,#3b82f6)" },
            { to: "/vault",        icon: Eye,      label: "Browse Vault",  desc: "View all your stored secrets",   bg: "linear-gradient(135deg,#7c3aed,#8b5cf6)" },
            { to: "/profile",      icon: Activity, label: "Activity Logs", desc: "See recent vault activity",      bg: "linear-gradient(135deg,#059669,#10b981)" },
          ].map(({ to, icon: Icon, label, desc, bg }) => (
            <Link to={to} key={to} className="action-card">
              <div className="action-icon" style={{ background: bg }}><Icon /></div>
              <div className="action-text"><p>{label}</p><span>{desc}</span></div>
              <div className="action-arrow"><ArrowRight /></div>
            </Link>
          ))}
        </div>

        {/* Lower panels */}
        <div className="dash-lower">
          {/* Recent items */}
          <div className="dash-panel">
            <div className="panel-head">
              <h2><span className="icon-blue" style={{display:'flex',width:18,height:18,borderRadius:4}}><Shield /></span> Recent Items</h2>
              <Link to="/vault">View all <ArrowRight /></Link>
            </div>
            {recent.length === 0 ? (
              <div className="panel-empty">
                <Shield />
                <p>No vault items yet.</p>
                <Link to="/vault/create">Add your first item →</Link>
              </div>
            ) : (
              <div className="dash-recent">
                {recent.map(item => {
                  const Icon = typeIcon[item.type] || Shield;
                  const cls  = typeClass[item.type] || "icon-slate";
                  const isLocked = item.isLocked && item.unlockAt && new Date(item.unlockAt) > new Date();
                  return (
                    <Link key={item._id} to={`/vault/${item._id}`} className="recent-item">
                      <div className={`recent-type-icon ${cls}`}><Icon /></div>
                      <div className="recent-info">
                        <p>{item.title}</p>
                        <span>{item.type}</span>
                      </div>
                      {isLocked && <span style={{color:'#fb7185',fontSize:13}}>🔒</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="dash-panel">
            <div className="panel-head">
              <h2><span style={{color:'#a78bfa'}}><Clock /></span> Recent Activity</h2>
            </div>
            {logs.length === 0 ? (
              <div className="panel-empty">
                <Activity />
                <p>No activity logged yet.</p>
              </div>
            ) : (
              <div className="dash-logs">
                {logs.map(log => {
                  const m = actionMeta[log.action] || { dot: "dot-slate", bg: "bg-slate" };
                  return (
                    <div key={log._id} className="log-item">
                      <div className={`log-dot-wrap ${m.bg}`}>
                        <div className={`log-dot ${m.dot}`} />
                      </div>
                      <div className="log-info">
                        <p>{log.details || log.action}</p>
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
