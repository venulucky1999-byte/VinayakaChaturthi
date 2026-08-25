import { useEffect, useState } from "react";
import { Plus, Search, UserRound, Trash2 } from "lucide-react";

function Collections({ user, refreshDashboard }) {
  const [collections, setCollections] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");

  const [amount, setAmount] = useState("");

  const [collectionDate, setCollectionDate] = useState("");

  // =========================================
  // GET COLLECTIONS
  // =========================================

  const fetchCollections = () => {
    fetch("http://127.0.0.1:8000/api/collections")
      .then((response) => response.json())

      .then((data) => {
        setCollections(data.collections || []);
      })

      .catch((error) => {
        console.error("Collections Error:", error);
      });
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
      const response = await fetch("http://127.0.0.1:8000/api/collections", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name,
          amount: Number(amount),
          collection_date: collectionDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add collection");
      }

      // Clear form

      setName("");
      setAmount("");
      setCollectionDate("");

      // Close modal

      setShowForm(false);

      // Refresh collections

      fetchCollections();

      // IMPORTANT:
      // Refresh dashboard immediately

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
      const response = await fetch(
        `http://127.0.0.1:8000/api/collections/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete collection");
      }

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
  // SEARCH
  // =========================================

  const filteredCollections = collections.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  // =========================================
  // UI
  // =========================================

  return (
    <div className="page">
      {/* ================= ADD MODAL ================= */}

      {showForm && (
        <div className="modal-overlay">
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

              {/* BUTTONS */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  <Plus size={19} />
                  Add Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
        <div>
          <p className="page-label">FUND MANAGEMENT</p>

          <h1>Collections</h1>

          <p className="page-description">Track all festival contributions</p>
        </div>

        {/* ADMIN ONLY */}

        {user && user.role === "admin" && (
          <button className="primary-button" onClick={() => setShowForm(true)}>
            <Plus size={19} />
            Add Collection
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}

      <div className="table-card">
        {/* TOOLBAR */}

        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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

                <th>Amount</th>

                <th>Date</th>

                {/* ADMIN */}

                {user && user.role === "admin" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {filteredCollections.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="person">
                      <div className="person-icon">
                        <UserRound size={17} />
                      </div>

                      <span>{item.name}</span>
                    </div>
                  </td>

                  <td className="amount">
                    ₹{Number(item.amount).toLocaleString("en-IN")}
                  </td>

                  <td>{item.collection_date}</td>

                  {/* ADMIN DELETE */}

                  {user && user.role === "admin" && (
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteCollection(item.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Collections;
