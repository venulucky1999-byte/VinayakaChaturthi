import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Collections from "./components/Collections";
import Expenses from "./components/Expenses";
import Gallery from "./components/Gallery";
import Sidebar from "./components/Sidebar";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dashboard, setDashboard] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Login states
  const [showLogin, setShowLogin] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [user, setUser] = useState(null);

  // =========================================
  // CURRENT PAGE
  // =========================================

  const getActivePage = () => {
    switch (location.pathname) {
      case "/collections":
        return "Collections";

      case "/expenses":
        return "Expenses";

      case "/gallery":
        return "Photo Gallery";

      default:
        return "Dashboard";
    }
  };

  const activePage = getActivePage();

  // =========================================
  // PAGE NAVIGATION
  // =========================================

  const handlePageChange = (page) => {
    setMobileOpen(false);

    switch (page) {
      case "Dashboard":
        navigate("/");
        break;

      case "Collections":
        navigate("/collections");
        break;

      case "Expenses":
        navigate("/expenses");
        break;

      case "Photo Gallery":
        navigate("/gallery");
        break;

      default:
        navigate("/");
    }
  };

  // =========================================
  // REFRESH DASHBOARD
  // =========================================

  const refreshDashboard = () => {
    fetch("https://vinayaka-chaturthi-api.onrender.com/api/dashboard")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        return response.json();
      })
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

      // Save logged-in user
      setUser(data.user);

      // Close login modal
      setShowLogin(false);

      // Clear login form
      setLoginUsername("");
      setLoginPassword("");
      setLoginError("");
    } catch (error) {
      console.error("Login Error:", error);

      setLoginError("Unable to connect to server");
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    setUser(null);

    // Go back to Dashboard
    navigate("/");
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
        setActivePage={handlePageChange}
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

        {/* ================= ROUTES ================= */}

        <Routes>
          {/* DASHBOARD */}

          <Route
            path="/"
            element={
              <Dashboard
                dashboard={dashboard}
                setActivePage={handlePageChange}
              />
            }
          />

          {/* COLLECTIONS */}

          <Route
            path="/collections"
            element={
              <Collections user={user} refreshDashboard={refreshDashboard} />
            }
          />

          {/* EXPENSES */}

          <Route
            path="/expenses"
            element={
              <Expenses user={user} refreshDashboard={refreshDashboard} />
            }
          />

          {/* PHOTO GALLERY */}

          <Route path="/gallery" element={<Gallery user={user} />} />

          {/* UNKNOWN URL */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
