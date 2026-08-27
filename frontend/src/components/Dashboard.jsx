import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
// import { useNavigate } from "react-router-dom";

function Dashboard({ dashboard, setActivePage }) {
  const collection = dashboard?.total_collection ?? 0;
  const expenditure = dashboard?.total_expenditure ?? 0;
  const balance = dashboard?.remaining_balance ?? 0;
  // const navigate = useNavigate();
  return (
    <div className="modern-dashboard">
      {/* =========================
          HERO SECTION
      ========================== */}

      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={15} />
            Festival Management
          </div>

          <p className="hero-welcome">Welcome back 👋</p>

          <h1>Vinayaka Chaturthi</h1>

          <p className="hero-location">Bondilipuram Pondari Street</p>

          <p className="hero-description">
            Manage your festival collections, expenses and funds all in one
            place.
          </p>
        </div>

        <div className="hero-symbol">🪔</div>
      </section>

      {/* =========================
          FINANCIAL CARDS
      ========================== */}

      <section className="financial-grid">
        {/* Collection */}

        <div
          className="financial-card collection-card"
          onClick={() => setActivePage("Collections")}
        >
          <div className="card-top">
            <div className="financial-icon">
              <TrendingUp size={22} />
            </div>

            <div className="card-trend positive">
              <ArrowUpRight size={16} />
              Collection
            </div>
          </div>

          <p className="card-label">Total Collection</p>

          <h2>₹{collection.toLocaleString("en-IN")}</h2>

          <p className="card-footer">Festival contributions</p>
        </div>

        {/* Expenditure */}

        <div
          className="financial-card expense-card"
          onClick={() => setActivePage("Expenses")}
        >
          <div className="card-top">
            <div className="financial-icon">
              <TrendingDown size={22} />
            </div>

            <div className="card-trend negative">
              <ArrowDownRight size={16} />
              Expenses
            </div>
          </div>

          <p className="card-label">Total Expenditure</p>

          <h2>₹{expenditure.toLocaleString("en-IN")}</h2>

          <p className="card-footer">Festival expenses</p>
        </div>

        {/* Balance */}

        <div className="financial-card balance-card">
          <div className="card-top">
            <div className="financial-icon">
              <Wallet size={22} />
            </div>

            <div className="card-trend balance-trend">
              <Wallet size={15} />
              Available
            </div>
          </div>

          <p className="card-label">Remaining Balance</p>

          <h2>₹{balance.toLocaleString("en-IN")}</h2>

          <p className="card-footer">Available festival fund</p>
        </div>
      </section>

      {/* =========================
          FUND OVERVIEW
      ========================== */}

      <section className="overview-section">
        <div className="overview-card">
          <div className="overview-left">
            <div className="overview-icon">
              <IndianRupee size={28} />
            </div>

            <div>
              <p className="overview-label">FESTIVAL FUND</p>

              <h2>Fund Overview</h2>

              <p>
                Keep track of every contribution and expense during the Vinayaka
                Chaturthi celebrations.
              </p>
            </div>
          </div>

          <div className="overview-numbers">
            <div>
              <span>Collected</span>

              <strong>₹{collection.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>Spent</span>

              <strong>₹{expenditure.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>Balance</span>

              <strong>₹{balance.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FOOTER MESSAGE
      ========================== */}

      <div className="dashboard-message">
        <span>🙏</span>

        <div>
          <strong>Ganapathi Bappa Morya</strong>

          <p>Together we make the celebration memorable.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
