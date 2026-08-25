import { LayoutDashboard, Wallet, Receipt, Image, X } from "lucide-react";

function Sidebar({
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
  user,
  onLogin,
  onLogout,
}) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Collections",
      icon: Wallet,
    },
    {
      name: "Expenses",
      icon: Receipt,
    },
    {
      name: "Photo Gallery",
      icon: Image,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        {/* ================= HEADER ================= */}

        <div className="sidebar-header">
          <div className="logo">🐘</div>

          <div>
            <h2>Vinayaka</h2>
            <span>Chaturthi</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setMobileOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* ================= MENU ================= */}

        <nav className="sidebar-menu">
          <p className="menu-title">MENU</p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`menu-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.name);

                  setMobileOpen(false);
                }}
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* ================= LOGIN ================= */}

        <div className="sidebar-auth">
          {!user ? (
            <button className="login-sidebar-button" onClick={onLogin}>
              🔐 Login
            </button>
          ) : (
            <>
              <div className="logged-user">
                <div className="user-avatar">👤</div>

                <div>
                  <strong>{user.username}</strong>

                  <span>{user.role}</span>
                </div>
              </div>

              <button className="logout-sidebar-button" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </div>

        {/* ================= FOOTER ================= */}

        <div className="sidebar-footer">
          <p>Vinayaka Chaturthi</p>

          <span>Festival Management</span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
