import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import Dashboard from "./components/Dashboard";
import Collections from "./components/Collections";
import Expenses from "./components/Expenses";
import Gallery from "./components/Gallery";
import Sidebar from "./components/Sidebar";

import "./App.css";

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Login states
  const [showLogin, setShowLogin] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [user, setUser] = useState(null);

  // =========================================
  // REFRESH DASHBOARD
  // =========================================

  const refreshDashboard = () => {
    fetch("https://vinayaka-chaturthi-api.onrender.com/api/dashboard")
      .then((response) => response.json())
      .then((data) => {
        setDashboard(data);
      })
      .catch((error) => {
        console.error("Dashboard Error:", error);
      });
  };

  // =========================================
  // LOAD DASHBOARD
  // =========================================

  useEffect(() => {
    refreshDashboard();
  }, []);

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async () => {
    setLoginError("");

    try {
      const response = await fetch(
        "https://vinayaka-chaturthi-api.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: loginUsername,
            password: loginPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.detail || "Invalid username or password");
        return;
      }

      setUser(data.user);

      setShowLogin(false);

      setLoginUsername("");
      setLoginPassword("");
      setLoginError("");
    } catch (error) {
      console.error(error);

      setLoginError("Unable to connect to server");
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    setUser(null);
    setActivePage("Dashboard");
  };

  // =========================================
  // LOADING
  // =========================================

  if (!dashboard) {
    return <div className="loading">Loading...</div>;
  }

  // =========================================
  // APP
  // =========================================

  return (
    <div className="app-layout">
      {/* ================= SIDEBAR ================= */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />

      {/* ================= MAIN ================= */}

      <main className="main-content">
        {/* ================= LOGIN MODAL ================= */}

        {showLogin && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Admin Login</h2>

              <p className="modal-description">
                Login to manage festival data.
              </p>

              {/* USERNAME */}

              <div className="form-group">
                <label>Username</label>

                <input
                  type="text"
                  placeholder="Enter username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
              </div>

              {/* PASSWORD */}

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              {/* ERROR */}

              {loginError && <div className="login-error">{loginError}</div>}

              {/* BUTTONS */}

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setShowLogin(false);
                    setLoginError("");
                  }}
                >
                  Cancel
                </button>

                <button className="primary-button" onClick={handleLogin}>
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MOBILE MENU ================= */}

        <button
          className="mobile-menu-button"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* ================= DASHBOARD ================= */}

        {activePage === "Dashboard" && (
          <Dashboard dashboard={dashboard} setActivePage={setActivePage} />
        )}

        {/* ================= COLLECTIONS ================= */}

        {activePage === "Collections" && (
          <Collections user={user} refreshDashboard={refreshDashboard} />
        )}

        {/* ================= EXPENSES ================= */}

        {activePage === "Expenses" && (
          <Expenses user={user} refreshDashboard={refreshDashboard} />
        )}

        {/* ================= PHOTO GALLERY ================= */}

        {activePage === "Photo Gallery" && <Gallery user={user} />}
      </main>
    </div>
  );
}

export default App;
