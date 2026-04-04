import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage  from "./pages/landingPage/landingPage";
import Login        from "./pages/auth/login";
import Signup       from "./pages/auth/signup";
import Dashboard    from "./pages/dashboard/dashboard";
import VaultList    from "./pages/vault/VaultList";
import CreateVault  from "./pages/vault/CreateVault";
import ViewVault    from "./pages/vault/ViewVault";
import ShareAccess  from "./pages/share/ShareAccess";
import Profile      from "./pages/profile/Profile";

function PrivatePage({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"              element={<LandingPage />} />
        <Route path="/auth/login"    element={<Login />} />
        <Route path="/auth/signup"   element={<Signup />} />
        <Route path="/share/:token"  element={<ShareAccess />} />

        {/* Protected */}
        <Route path="/dashboard"   element={<PrivatePage><Dashboard /></PrivatePage>} />
        <Route path="/vault"       element={<PrivatePage><VaultList /></PrivatePage>} />
        <Route path="/vault/create" element={<PrivatePage><CreateVault /></PrivatePage>} />
        <Route path="/vault/:id"   element={<PrivatePage><ViewVault /></PrivatePage>} />
        <Route path="/profile"     element={<PrivatePage><Profile /></PrivatePage>} />
      </Routes>
    </BrowserRouter>
  );
}
