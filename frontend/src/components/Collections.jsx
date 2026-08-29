import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  UserRound,
  Trash2,
  Printer,
  Pencil,
  X,
  Users,
  Wallet,
  HardHat,
  HeartHandshake,
  Utensils,
  HandCoins,
  MoreHorizontal,
} from "lucide-react";

function Collections({ user, refreshDashboard }) {
  const [collections, setCollections] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ADD / EDIT MODAL
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // FORM STATES
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [category, setCategory] = useState("");

  const API_URL = "https://vinayaka-chaturthi-api.onrender.com";

  // =====================================================
  // COLLECTION CATEGORIES
  // =====================================================

  const categories = [
    "Employees",
    "Pensioners",
    "Youth",
    "Labor",
    "Annavithrana",
    "Hundi",
    "Others",
  ];

  // =====================================================
  // CATEGORY ICONS
  // =====================================================

  const categoryIcons = {
    Employees: <Users size={22} />,
    Pensioners: <HeartHandshake size={22} />,
    Youth: <UserRound size={22} />,
    Labor: <HardHat size={22} />,
    Annavithrana: <Utensils size={22} />,
    Hundi: <HandCoins size={22} />,
    Others: <MoreHorizontal size={22} />,
  };

  // =====================================================
  // GET COLLECTIONS
  // =====================================================

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/api/collections`);

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      const data = await response.json();

      setCollections(data.collections || []);
    } catch (error) {
      console.error("Collections Error:", error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // =====================================================
  // RESET / CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);

    setName("");
    setAmount("");
    setCollectionDate("");
    setCategory("");
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {
    setEditingId(null);

    setName("");
    setAmount("");
    setCollectionDate("");
    setCategory("");

    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (item) => {
    setEditingId(item.id);

    setName(item.name || "");
    setAmount(item.amount || "");
    setCollectionDate(item.collection_date || "");
    setCategory(item.category || "");

    setShowForm(true);
  };

  // =====================================================
  // ADD / UPDATE COLLECTION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter person name");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!collectionDate) {
      alert("Please select collection date");
      return;
    }

    if (!category) {
      alert("Please select a category");
      return;
    }

    const collectionData = {
      name: name.trim(),
      amount: Number(amount),
      collection_date: collectionDate,
      category: category,
    };

    try {
      let response;

      // =================================================
      // UPDATE
      // =================================================

      if (editingId !== null) {
        response = await fetch(`${API_URL}/api/collections/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(collectionData),
        });
      }

      // =================================================
      // ADD
      // =================================================
      else {
        response = await fetch(`${API_URL}/api/collections`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(collectionData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save collection");
      }

      alert(
        editingId !== null
          ? "Collection updated successfully"
          : "Collection added successfully",
      );

      closeForm();

      await fetchCollections();

      refreshDashboard();
    } catch (error) {
      console.error("Collection Save Error:", error);

      alert(error.message || "Unable to save collection");
    }
  };

  // =====================================================
  // DELETE COLLECTION
  // =====================================================

  const handleDeleteCollection = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this collection?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/collections/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete collection");
      }

      setCollections((currentCollections) =>
        currentCollections.filter((item) => item.id !== id),
      );

      refreshDashboard();

      alert("Collection deleted successfully");
    } catch (error) {
      console.error("Delete Collection Error:", error);

      alert(error.message || "Unable to delete collection");
    }
  };

  // =====================================================
  // CATEGORY TOTAL
  // =====================================================

  const getCategoryTotal = (categoryName) => {
    return collections
      .filter((item) => item.category === categoryName)
      .reduce((total, item) => total + Number(item.amount || 0), 0);
  };

  // =====================================================
  // CATEGORY COUNT
  // =====================================================

  const getCategoryCount = (categoryName) => {
    return collections.filter((item) => item.category === categoryName).length;
  };

  // =====================================================
  // TOTAL COLLECTION
  // =====================================================

  const totalCollection = collections.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );

  // =====================================================
  // FILTER + SEARCH
  // =====================================================

  const filteredCollections = collections.filter((item) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      item.name?.toLowerCase().includes(searchText) ||
      item.category?.toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // =====================================================
  // FILTERED TOTAL
  // =====================================================

  const filteredTotal = filteredCollections.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );

  // =====================================================
  // CARD CLICK
  // =====================================================

  const handleCardClick = (categoryName) => {
    setCategoryFilter(categoryName);
  };

  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow pop-ups to print.");
      return;
    }

    const rows = filteredCollections
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.name || "-"}</td>
            <td>${item.category || "-"}</td>
            <td>₹${Number(item.amount || 0).toLocaleString("en-IN")}</td>
            <td>${item.collection_date || "-"}</td>
          </tr>
        `,
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>

        <head>

          <title>Festival Collections</title>

          <style>

            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #222;
            }

            .header {
              text-align: center;
              margin-bottom: 25px;
            }

            .header h1 {
              margin: 0;
              font-size: 26px;
            }

            .header h2 {
              margin: 6px 0;
              font-size: 18px;
              font-weight: normal;
            }

            .header p {
              margin: 5px 0;
              color: #666;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            th,
            td {
              border: 1px solid #ccc;
              padding: 10px;
              text-align: left;
            }

            th {
              background: #f3f4f6;
              font-weight: bold;
            }

            .total {
              margin-top: 20px;
              text-align: right;
              font-size: 18px;
              font-weight: bold;
            }

          </style>

        </head>

        <body>

          <div class="header">

            <h1>
              Vinayaka Chaturthi
            </h1>

            <h2>
              Collection Report
            </h2>

            <p>
              Bondilipuram Pondari Street
            </p>

            <p>
              ${
                categoryFilter === "All"
                  ? "All Categories"
                  : `Category: ${categoryFilter}`
              }
            </p>

            ${search ? `<p>Search: <strong>${search}</strong></p>` : ""}

          </div>

          <table>

            <thead>

              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>

            </thead>

            <tbody>

              ${
                rows ||
                `
                  <tr>

                    <td
                      colspan="5"
                      style="text-align:center;"
                    >
                      No collections found
                    </td>

                  </tr>
                `
              }

            </tbody>

          </table>

          <div class="total">

            Total Collections:
            ₹${filteredTotal.toLocaleString("en-IN")}

          </div>

        </body>

      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="page collections-page">
      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId !== null ? "Edit Collection" : "Add Collection"}
                </h2>

                <p className="modal-description">
                  {editingId !== null
                    ? "Update the collection details below."
                    : "Enter the details of the new collection."}
                </p>
              </div>

              <button type="button" className="modal-close" onClick={closeForm}>
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* NAME */}

              <div className="form-group">
                <label>Person Name</label>

                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* AMOUNT */}

              <div className="form-group">
                <label>Amount</label>

                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>

              {/* DATE */}

              <div className="form-group">
                <label>Collection Date</label>

                <input
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  required
                />
              </div>

              {/* CATEGORY */}

              <div className="form-group">
                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* BUTTONS */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingId !== null ? (
                    <>
                      <Pencil size={18} />
                      Update Collection
                    </>
                  ) : (
                    <>
                      <Plus size={19} />
                      Add Collection
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">
        <div>
          <p className="page-label">FUND MANAGEMENT</p>

          <h1>Collections</h1>

          <p className="page-description">Track all festival contributions</p>
        </div>

        <div className="page-header-actions">
          <button className="secondary-button" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </button>

          {user && user.role === "admin" && (
            <button className="primary-button" onClick={openAddForm}>
              <Plus size={19} />
              Add Collection
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          8 COLLECTION CARDS
      ================================================= */}

      <div className="expense-summary-grid">
        {/* TOTAL */}

        <div
          className={`summary-card total-card ${
            categoryFilter === "All" ? "active" : ""
          }`}
          onClick={() => handleCardClick("All")}
        >
          <div className="summary-card-icon">
            <Wallet size={22} />
          </div>

          <div className="summary-card-content">
            <span>Total Collections</span>

            <strong>₹{totalCollection.toLocaleString("en-IN")}</strong>

            <small>{collections.length} collections</small>
          </div>
        </div>

        {/* 7 CATEGORY CARDS */}

        {categories.map((cat) => (
          <div
            key={cat}
            className={`summary-card ${categoryFilter === cat ? "active" : ""}`}
            onClick={() => handleCardClick(cat)}
          >
            <div className="summary-card-icon">{categoryIcons[cat]}</div>

            <div className="summary-card-content">
              <span>{cat} Total</span>

              <strong>₹{getCategoryTotal(cat).toLocaleString("en-IN")}</strong>

              <small>{getCategoryCount(cat)} collections</small>
            </div>
          </div>
        ))}
      </div>

      {/* =================================================
          ACTIVE FILTER
      ================================================= */}

      {categoryFilter !== "All" && (
        <div className="active-filter">
          <span>
            Showing:
            <strong> {categoryFilter}</strong>
          </span>

          <button onClick={() => setCategoryFilter("All")}>
            <X size={15} />
            Clear
          </button>
        </div>
      )}

      {/* =================================================
          TABLE CARD
      ================================================= */}

      <div className="table-card">
        {/* TOOLBAR */}

        <div className="table-toolbar">
          {/* SEARCH */}

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* COUNT */}

          <div className="collection-count">
            {filteredCollections.length} Collections
          </div>

          {/* FILTERED TOTAL */}

          <div className="filtered-total">
            Total:
            <strong>₹{filteredTotal.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>

                <th>Category</th>

                <th>Amount</th>

                <th>Date</th>

                {user && user.role === "admin" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {filteredCollections.length === 0 ? (
                <tr>
                  <td
                    colSpan={user?.role === "admin" ? 5 : 4}
                    className="empty-state"
                  >
                    No collections found
                  </td>
                </tr>
              ) : (
                filteredCollections.map((item) => (
                  <tr key={item.id}>
                    {/* NAME */}

                    <td>
                      <div className="person">
                        <div className="person-icon">
                          <UserRound size={17} />
                        </div>

                        <span>{item.name}</span>
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td>
                      <span className="category-badge">
                        {item.category || "Others"}
                      </span>
                    </td>

                    {/* AMOUNT */}

                    <td className="amount">
                      ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                    </td>

                    {/* DATE */}

                    <td>{item.collection_date}</td>

                    {/* ACTION */}

                    {user && user.role === "admin" && (
                      <td>
                        <div className="action-buttons">
                          {/* EDIT */}

                          <button
                            className="edit-button"
                            onClick={() => openEditForm(item)}
                            title="Edit Collection"
                          >
                            <Pencil size={16} />
                          </button>

                          {/* DELETE */}

                          <button
                            className="delete-button"
                            onClick={() => handleDeleteCollection(item.id)}
                            title="Delete Collection"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>

            {/* TOTAL */}

            {filteredCollections.length > 0 && (
              <tfoot>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <strong>Total</strong>
                  </td>

                  <td className="amount">
                    <strong>₹{filteredTotal.toLocaleString("en-IN")}</strong>
                  </td>

                  <td></td>

                  {user && user.role === "admin" && <td></td>}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default Collections;
