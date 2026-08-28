import { useEffect, useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function Dashboard({ dashboard, setActivePage }) {
  const collection = dashboard?.total_collection ?? 0;
  const expenditure = dashboard?.total_expenditure ?? 0;
  const balance = dashboard?.remaining_balance ?? 0;

  // =========================================
  // GALLERY PHOTOS
  // =========================================

  const photos = [
    {
      id: 1,
      title: "Ganesh Decoration",
      image: "/gallery/ganesh1.jpg",
    },
    {
      id: 2,
      title: "Ganesh Idol 2015",
      image: "/gallery/ganesh2015 .jpg",
    },
    {
      id: 3,
      title: "Festival Celebration 2017",
      image: "/gallery/ganesh2017.jpg",
    },
    {
      id: 4,
      title: "Pooja Ceremony 2018",
      image: "/gallery/ganesh2018.jpg",
    },
    {
      id: 5,
      title: "Festival Decorations 2019",
      image: "/gallery/ganesh2019.jpg",
    },
    {
      id: 6,
      title: "Ganesh Chaturthi 2022",
      image: "/gallery/ganesh2022 (1).jpg",
    },
    {
      id: 7,
      title: "Community Celebration 2022",
      image: "/gallery/ganesh2022 (2).jpg",
    },
    {
      id: 8,
      title: "Evening Celebration 2023",
      image: "/gallery/ganesh2023.jpg",
    },
    {
      id: 9,
      title: "Pooja 2024",
      image: "/gallery/ganesh2024.jpg",
    },
    {
      id: 10,
      title: "Ganapathi Bappa Morya 2025",
      image: "/gallery/ganesh2025.jpg",
    },
  ];

  // =========================================
  // CAROUSEL STATE
  // =========================================

  const [currentPhoto, setCurrentPhoto] = useState(0);

  // =========================================
  // AUTO SLIDE
  // =========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [photos.length]);

  // =========================================
  // PREVIOUS PHOTO
  // =========================================

  const previousPhoto = () => {
    setCurrentPhoto((currentPhoto - 1 + photos.length) % photos.length);
  };

  // =========================================
  // NEXT PHOTO
  // =========================================

  const nextPhoto = () => {
    setCurrentPhoto((currentPhoto + 1) % photos.length);
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="modern-dashboard">
      {/* =========================================
          HERO SECTION
      ========================================== */}

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

      {/* =========================================
          PHOTO CAROUSEL
      ========================================== */}

      <section className="dashboard-gallery">
        {/* HEADER */}

        <div className="dashboard-gallery-header">
          <div>
            <p className="page-label">FESTIVAL MEMORIES</p>

            <h2>Our Celebrations</h2>

            <p>Beautiful memories from our Vinayaka Chaturthi celebrations</p>
          </div>

          {/* VIEW GALLERY */}

          <button
            className="view-gallery-button"
            onClick={() => setActivePage("Photo Gallery")}
          >
            View Gallery
            <span>→</span>
          </button>
        </div>

        {/* CAROUSEL */}

        <div className="dashboard-carousel">
          {/* IMAGE */}

          <img
            src={photos[currentPhoto].image}
            alt={photos[currentPhoto].title}
            className="dashboard-carousel-image"
          />

          {/* PREVIOUS */}

          <button
            className="carousel-button carousel-prev"
            onClick={previousPhoto}
            aria-label="Previous photo"
          >
            ❮
          </button>

          {/* NEXT */}

          <button
            className="carousel-button carousel-next"
            onClick={nextPhoto}
            aria-label="Next photo"
          >
            ❯
          </button>

          {/* CAPTION */}

          <div className="carousel-caption">
            <h3>{photos[currentPhoto].title}</h3>

            <span>
              {currentPhoto + 1} / {photos.length}
            </span>
          </div>
        </div>

        {/* DOTS */}

        <div className="carousel-dots">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              className={`carousel-dot ${
                currentPhoto === index ? "active" : ""
              }`}
              onClick={() => setCurrentPhoto(index)}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =========================================
          FINANCIAL CARDS
      ========================================== */}

      <section className="financial-grid">
        {/* COLLECTION */}

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

        {/* EXPENSES */}

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

        {/* BALANCE */}

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

      {/* =========================================
          FUND OVERVIEW
      ========================================== */}

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

      {/* =========================================
          FOOTER MESSAGE
      ========================================== */}

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
