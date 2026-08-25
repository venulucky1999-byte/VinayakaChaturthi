import { useEffect, useState } from "react";
import { Plus, Search, Receipt, Trash2 } from "lucide-react";

function Expenses({ user, refreshDashboard }) {
  const [expenses, setExpenses] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [description, setDescription] = useState("");

  const [amount, setAmount] = useState("");

  const [expenseDate, setExpenseDate] = useState("");

  // =========================================
  // GET EXPENSES
  // =========================================

  const fetchExpenses = () => {
    fetch("https://vinayaka-chaturthi-api.onrender.com/api/expenses")
      .then((response) => response.json())
      .then((data) => {
        setExpenses(data.expenses || []);
      })
      .catch((error) => {
        console.error("Expenses Error:", error);
      });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // =========================================
  // ADD EXPENSE
  // =========================================

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://vinayaka-chaturthi-api.onrender.com/api/expenses",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            description: description,
            amount: Number(amount),
            expense_date: expenseDate,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      // Clear form
      setDescription("");
      setAmount("");
      setExpenseDate("");

      // Close modal
      setShowForm(false);

      // Refresh expenses
      fetchExpenses();

      // Refresh dashboard
      refreshDashboard();
    } catch (error) {
      console.error("Add Expense Error:", error);
    }
  };

  // =========================================
  // DELETE EXPENSE
  // =========================================

  const handleDeleteExpense = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `https://vinayaka-chaturthi-api.onrender.com/api/expenses/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter((item) => item.id !== id),
      );

      // Refresh dashboard
      refreshDashboard();
    } catch (error) {
      console.error("Delete Expense Error:", error);
    }
  };

  // =========================================
  // SEARCH
  // =========================================

  const filteredExpenses = expenses.filter((item) =>
    item.description.toLowerCase().includes(search.toLowerCase()),
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
            <h2>Add Expense</h2>

            <p className="modal-description">
              Enter the details of the new expense.
            </p>

            <form onSubmit={handleAddExpense}>
              {/* DESCRIPTION */}

              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  placeholder="Enter expense description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                <label>Expense Date</label>

                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
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
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}

      <div className="page-header">
        <div>
          <p className="page-label">FUND MANAGEMENT</p>

          <h1>Expenses</h1>

          <p className="page-description">Track all festival expenses</p>
        </div>

        {/* ADMIN ONLY */}

        {user && user.role === "admin" && (
          <button className="primary-button" onClick={() => setShowForm(true)}>
            <Plus size={19} />
            Add Expense
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
              placeholder="Search expense..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="collection-count">
            {filteredExpenses.length} Expenses
          </div>
        </div>

        {/* TABLE */}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Description</th>

                <th>Amount</th>

                <th>Date</th>

                {/* ADMIN */}

                {user && user.role === "admin" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="person">
                      <div className="person-icon">
                        <Receipt size={17} />
                      </div>

                      <span>{item.description}</span>
                    </div>
                  </td>

                  <td className="amount">
                    ₹{Number(item.amount).toLocaleString("en-IN")}
                  </td>

                  <td>{item.expense_date}</td>

                  {/* ADMIN DELETE */}

                  {user && user.role === "admin" && (
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteExpense(item.id)}
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

export default Expenses;