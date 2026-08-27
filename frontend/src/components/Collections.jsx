import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  UserRound,
  Trash2,
  Printer,
} from "lucide-react";

function Collections({ user, refreshDashboard }) {
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [category, setCategory] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const API_URL = "https://vinayaka-chaturthi-api.onrender.com";

  // =========================================
  // GET COLLECTIONS
  // =========================================

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/api/collections`);

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      const data = await response.json();

      console.log("Collections data:", data);

      setCollections(data.collections || []);
    } catch (error) {
      console.error("Collections Error:", error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // =========================================
  // ADD COLLECTION
  // =========================================

  const handleAddCollection = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/collections`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name,
          amount: Number(amount),
          collection_date: collectionDate,
          category: category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add collection");
      }

      // Clear form
      setName("");
      setAmount("");
      setCollectionDate("");
      setCategory("");

      // Close modal
      setShowForm(false);

      // Get latest collections
      await fetchCollections();

      // Refresh dashboard
      refreshDashboard();
    } catch (error) {
      console.error("Add Collection Error:", error);
    }
  };

  // =========================================
  // DELETE COLLECTION
  // =========================================

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

      if (!response.ok) {
        throw new Error("Failed to delete collection");
      }

      // Remove from screen immediately
      setCollections((currentCollections) =>
        currentCollections.filter((item) => item.id !== id),
      );

      // Refresh dashboard
      refreshDashboard();
    } catch (error) {
      console.error("Delete Collection Error:", error);
    }
  };

  // =========================================
  // SEARCH + CATEGORY FILTER
  // =========================================

  const filteredCollections = collections.filter((item) => {
    const itemName = item.name || "";
    const itemCategory = item.category || "";

    const matchesSearch = itemName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      itemCategory === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // =========================================
  // PRINT / DOWNLOAD
  // =========================================

  const handlePrint = () => {
    window.print();
  };

  // =========================================
  // TOTAL OF FILTERED COLLECTIONS
  // =========================================

  const filteredTotal = filteredCollections.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );

  // =========================================
  // UI
  // =========================================

  return (
    <div className="page collections-page">
      {/* ================= ADD MODAL ================= */}

      {showForm && (
        <div className="modal-overlay no-print">
          <div className="modal">
            <h2>Add Collection</h2>

            <p className="modal-description">
              Enter the details of the new collection.
            </p>

            <form onSubmit={handleAddCollection}>
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
                  required
                  min="1"
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
                  <option value="Employees">Employees</option>
                  <option value="Pensioners">Pensioners</option>
                  <option value="Youth">Youth</option>
                  <option value="Labor">Labor</option>
                </select>
              </div>

              {/* BUTTONS */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <Plus size={19} />
                  Add Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header no-print">
        <div>
          <p className="page-label">FUND MANAGEMENT</p>

          <h1>Collections</h1>

          <p className="page-description">
            Track all festival contributions
          </p>
        </div>

        {/* ADMIN ONLY */}

        {user && user.role === "admin" && (
          <button
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={19} />
            Add Collection
          </button>
        )}
      </div>

      {/* ================= PRINT HEADER ================= */}

      <div className="print-header">
        <h1>Vinayaka Chaturthi</h1>

        <h2>Collection Report</h2>

        <p>Bondilipuram Pondari Street</p>

        <p>
          Category:{" "}
          <strong>
            {categoryFilter === "All"
              ? "All Categories"
              : categoryFilter}
          </strong>
        </p>

        {search && (
          <p>
            Search: <strong>{search}</strong>
          </p>
        )}
      </div>

      {/* ================= TABLE ================= */}

      <div className="table-card">
        {/* TOOLBAR */}

        <div className="table-toolbar no-print">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CATEGORY FILTER */}

          <select
            className="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Employees">Employees</option>
            <option value="Pensioners">Pensioners</option>
            <option value="Youth">Youth</option>
            <option value="Labor">Labor</option>
          </select>

          {/* PRINT BUTTON */}

          <button
            className="print-button"
            onClick={handlePrint}
            title="Print or Download as PDF"
          >
            <Printer size={18} />
            Print / Download
          </button>

          <div className="collection-count">
            {filteredCollections.length} Collections
          </div>
        </div>

        {/* TABLE */}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>

                <th>Category</th>

                <th>Amount</th>

                <th>Date</th>

                {user && user.role === "admin" && (
                  <th className="no-print">Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredCollections.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      user && user.role === "admin" ? 5 : 4
                    }
                    style={{ textAlign: "center" }}
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
                        <div className="person-icon no-print">
                          <UserRound size={17} />
                        </div>

                        <span>{item.name}</span>
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td>
                      <span className="category-badge">
                        {item.category || "—"}
                      </span>
                    </td>

                    {/* AMOUNT */}

                    <td className="amount">
                      ₹{Number(item.amount).toLocaleString("en-IN")}
                    </td>

                    {/* DATE */}

                    <td>{item.collection_date}</td>

                    {/* ADMIN DELETE */}

                    {user && user.role === "admin" && (
                      <td className="no-print">
                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteCollection(item.id)
                          }
                          title="Delete collection"
                        >
                          <Trash2 size={17} />
                        </button>
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
                    style={{ textAlign: "right" }}
                  >
                    <strong>Total</strong>
                  </td>

                  <td className="amount">
                    <strong>
                      ₹{filteredTotal.toLocaleString("en-IN")}
                    </strong>
                  </td>

                  <td></td>

                  {user && user.role === "admin" && (
                    <td className="no-print"></td>
                  )}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ================= PRINT FOOTER ================= */}

      <div className="print-footer">
        <p>
          Total Collections:{" "}
          <strong>{filteredCollections.length}</strong>
        </p>

        <p>
          Total Amount:{" "}
          <strong>
            ₹{filteredTotal.toLocaleString("en-IN")}
          </strong>
        </p>

        <p>Generated from Vinayaka Chaturthi Festival Management</p>
      </div>
    </div>
  );
}

export default Collections;