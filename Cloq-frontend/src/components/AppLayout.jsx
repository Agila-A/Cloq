import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "../hooks/useAuthState";
import "./AppLayout.css";

/* ── SVG Icons ── */
const DashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const ShieldIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const PlusIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogOutIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const ChevronRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const MenuIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const navLinks = [
  { to: "/dashboard",    icon: DashIcon,   label: "Dashboard" },
  { to: "/vault",        icon: ShieldIcon, label: "My Vault"  },
  { to: "/vault/create", icon: PlusIcon,   label: "Add Item"  },
  { to: "/profile",      icon: UserIcon,   label: "Profile"   },
];

function SidebarContent({ location, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuthState();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("firebaseToken");
    navigate("/auth/login");
  };

  return (
    <>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><ShieldIcon /></div>
        <span className="grad-text">Cloq</span>
        {onClose && (
          <button className="mobile-sidebar-close" onClick={onClose}>
            <CloseIcon />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navLinks.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} onClick={onClose}
              className={`nav-link${active ? " active" : ""}`}>
              <Icon />
              {label}
              {active && <span className="nav-link-chevron"><ChevronRight /></span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <div className="sidebar-avatar">
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="sidebar-user-text">
            <p>{user?.displayName || "Vault User"}</p>
            <p>{user?.email}</p>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOutIcon /> Sign Out
        </button>
      </div>
    </>
  );
}

export default function AppLayout({ children }) {
  const location      = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="layout-root">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <SidebarContent location={location} />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="mobile-overlay">
          <div className="mobile-overlay-bg" onClick={() => setOpen(false)} />
          <div className="mobile-sidebar">
            <SidebarContent location={location} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="layout-main">
        <div className="topbar">
          <div className="topbar-logo">
            <div className="topbar-logo-icon"><ShieldIcon /></div>
            <span className="grad-text">Cloq</span>
          </div>
          <button className="topbar-menu-btn" onClick={() => setOpen(true)}>
            <MenuIcon />
          </button>
        </div>

        <div className="layout-content">
          {children}
        </div>
      </main>
    </div>
  );
}
