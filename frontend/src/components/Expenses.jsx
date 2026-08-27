import { useEffect, useState } from "react";
import { Plus, Search, Receipt, Trash2, Printer } from "lucide-react";

function Expenses({ user, refreshDashboard }) {
  const [expenses, setExpenses] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [description, setDescription] = useState("");

  const [amount, setAmount] = useState("");

  const [expenseDate, setExpenseDate] = useState("");

  const API_URL = "https://vinayaka-chaturthi-api.onrender.com";

  // =========================================
  // GET EXPENSES
  // =========================================

  const fetchExpenses = () => {
    fetch(`${API_URL}/api/expenses`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        return response.json();
      })
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
      const response = await fetch(`${API_URL}/api/expenses`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          description: description,
          amount: Number(amount),
          expense_date: expenseDate,
        }),
      });

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
      const response = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: "DELETE",
      });

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
  // TOTAL FILTERED EXPENSES
  // =========================================

  const filteredTotal = filteredExpenses.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );

  // =========================================
  // PRINT / DOWNLOAD
  // =========================================

  const handlePrint = () => {
    window.print();
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="page expenses-page">
      {/* ================= ADD MODAL ================= */}

      {showForm && (
        <div className="modal-overlay no-print">
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

      <div className="page-header no-print">
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

      {/* ================= PRINT HEADER ================= */}

      <div className="expense-print-header">
        <h1>Vinayaka Chaturthi</h1>

        <h2>Expense Report</h2>

        <p>Bondilipuram Pondari Street</p>

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
              placeholder="Search expense..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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

                {user && user.role === "admin" && (
                  <th className="no-print">Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={user && user.role === "admin" ? 4 : 3}
                    style={{ textAlign: "center" }}
                  >
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((item) => (
                  <tr key={item.id}>
                    {/* DESCRIPTION */}

                    <td>
                      <div className="person">
                        <div className="person-icon no-print">
                          <Receipt size={17} />
                        </div>

                        <span>{item.description}</span>
                      </div>
                    </td>

                    {/* AMOUNT */}

                    <td className="amount">
                      ₹{Number(item.amount).toLocaleString("en-IN")}
                    </td>

                    {/* DATE */}

                    <td>{item.expense_date}</td>

                    {/* ADMIN DELETE */}

                    {user && user.role === "admin" && (
                      <td className="no-print">
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteExpense(item.id)}
                          title="Delete expense"
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

            {filteredExpenses.length > 0 && (
              <tfoot>
                <tr>
                  <td style={{ textAlign: "right" }}>
                    <strong>Total</strong>
                  </td>

                  <td className="amount">
                    <strong>₹{filteredTotal.toLocaleString("en-IN")}</strong>
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

      <div className="expense-print-footer">
        <p>
          Total Expenses: <strong>{filteredExpenses.length}</strong>
        </p>

        <p>
          Total Amount:{" "}
          <strong>₹{filteredTotal.toLocaleString("en-IN")}</strong>
        </p>

        <p>Generated from Vinayaka Chaturthi Festival Management</p>
      </div>
    </div>
  );
}

export default Expenses;
