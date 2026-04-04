import { Navigate } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";

const Shield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 28, height: 28, color: "#3b82f6", animation: "spin 1.5s linear infinite", display: "block" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthState();

  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh",
        background: "#060b14", gap: 12,
      }}>
        <Shield />
        <p style={{ fontSize: 13, color: "#475569" }}>Authenticating…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;
  return children;
}
