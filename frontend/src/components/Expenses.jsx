import { useEffect, useState } from "react";
import {
Plus,
Search,
Receipt,
Trash2,
Printer,
Filter,
Pencil,
X,
} from "lucide-react";

function Expenses({ user, refreshDashboard }) {
const [expenses, setExpenses] = useState([]);

const [search, setSearch] = useState("");
const [categoryFilter, setCategoryFilter] = useState("All");

// ADD / EDIT MODAL
const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState(null);

const [description, setDescription] = useState("");
const [amount, setAmount] = useState("");
const [expenseDate, setExpenseDate] = useState("");
const [category, setCategory] = useState("");

const API_URL = "https://vinayaka-chaturthi-api.onrender.com";

// =========================================
// EXPENSE CATEGORIES
// =========================================

const categories = [
"Pandal",
"Pooja",
"Annavitrana",
"Lights, Sound & DJ",
"Nimajjanam",
"Vigraha Data",
"Other",
];

// =========================================
// GET EXPENSES
// =========================================

const fetchExpenses = async () => {
try {
const response = await fetch(
`${API_URL}/api/expenses`,
);


  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }

  const data = await response.json();

  setExpenses(data.expenses || []);
} catch (error) {
  console.error("Expenses Error:", error);
}


};

useEffect(() => {
fetchExpenses();
}, []);

// =========================================
// OPEN ADD FORM
// =========================================

const openAddForm = () => {
setEditingId(null);


setDescription("");
setAmount("");
setExpenseDate("");
setCategory("");

setShowForm(true);

};

// =========================================
// OPEN EDIT FORM
// =========================================

const openEditForm = (item) => {
setEditingId(item.id);


setDescription(item.description || "");
setAmount(item.amount || "");
setExpenseDate(item.expense_date || "");
setCategory(item.category || "");

setShowForm(true);


};

// =========================================
// CLOSE FORM
// =========================================

const closeForm = () => {
setShowForm(false);
setEditingId(null);


setDescription("");
setAmount("");
setExpenseDate("");
setCategory("");


};

// =========================================
// ADD / EDIT EXPENSE
// =========================================

const handleSubmit = async (e) => {
e.preventDefault();


if (!description.trim()) {
  alert("Please enter expense description");
  return;
}

if (!amount || Number(amount) <= 0) {
  alert("Please enter a valid amount");
  return;
}

if (!expenseDate) {
  alert("Please select expense date");
  return;
}

if (!category) {
  alert("Please select a category");
  return;
}

const expenseData = {
  description: description.trim(),
  amount: Number(amount),
  expense_date: expenseDate,
  category: category,
};

try {
  let response;

  // =====================================
  // EDIT
  // =====================================

  if (editingId) {
    response = await fetch(
      `${API_URL}/api/expenses/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      },
    );
  }

  // =====================================
  // ADD
  // =====================================

  else {
    response = await fetch(
      `${API_URL}/api/expenses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      },
    );
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.detail ||
        "Failed to save expense",
    );
  }

  // CLOSE MODAL
  closeForm();

  // REFRESH EXPENSES
  await fetchExpenses();

  // REFRESH DASHBOARD
  refreshDashboard();

} catch (error) {
  console.error(
    "Expense Save Error:",
    error,
  );

  alert(
    error.message ||
      "Unable to save expense",
  );
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
    `${API_URL}/api/expenses/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.detail ||
        "Failed to delete expense",
    );
  }

  setExpenses((currentExpenses) =>
    currentExpenses.filter(
      (item) => item.id !== id,
    ),
  );

  // REFRESH DASHBOARD
  refreshDashboard();

} catch (error) {
  console.error(
    "Delete Expense Error:",
    error,
  );

  alert(
    error.message ||
      "Unable to delete expense",
  );
}


};

// =========================================
// FILTER + SEARCH
// =========================================

const filteredExpenses = expenses.filter(
(item) => {
const searchText =
search.toLowerCase().trim();


  const matchesSearch =
    item.description
      ?.toLowerCase()
      .includes(searchText) ||
    item.category
      ?.toLowerCase()
      .includes(searchText);

  const matchesCategory =
    categoryFilter === "All" ||
    item.category === categoryFilter;

  return (
    matchesSearch &&
    matchesCategory
  );
},


);

// =========================================
// PRINT
// =========================================

const handlePrint = () => {
const printWindow =
window.open("", "_blank");

if (!printWindow) {
  alert(
    "Please allow pop-ups to print expenses.",
  );
  return;
}

const rows = filteredExpenses
  .map(
    (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.description || "-"}</td>
        <td>${item.category || "Other"}</td>
        <td>₹${Number(
          item.amount,
        ).toLocaleString("en-IN")}</td>
        <td>${item.expense_date || "-"}</td>
      </tr>
    `,
  )
  .join("");

const totalAmount =
  filteredExpenses.reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0,
  );

printWindow.document.write(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Festival Expenses</title>

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

        .filter-info {
          margin-top: 10px;
          font-size: 14px;
          color: #555;
        }

        @media print {
          body {
            padding: 10px;
          }
        }
      </style>
    </head>

    <body>

      <div class="header">

        <h1>
          Vinayaka Chaturthi
        </h1>

        <h2>
          Festival Expenses
        </h2>

        <p>
          Bondilipuram Pondari Street
        </p>

        <div class="filter-info">
          ${
            categoryFilter === "All"
              ? "All Categories"
              : `Category: ${categoryFilter}`
          }
        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>S.No</th>
            <th>Description</th>
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
                  No expenses found
                </td>
              </tr>
            `
          }

        </tbody>

      </table>

      <div class="total">
        Total Expenses:
        ₹${totalAmount.toLocaleString(
          "en-IN",
        )}
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

// =========================================
// UI
// =========================================

return ( <div className="page">


  {/* =====================================
      ADD / EDIT MODAL
  ====================================== */}

  {showForm && (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          closeForm();
        }
      }}
    >

      <div className="modal expense-modal">

        {/* MODAL HEADER */}

        <div className="modal-header">

          <div>

            <h2>
              {editingId
                ? "Edit Expense"
                : "Add Expense"}
            </h2>

            <p className="modal-description">
              {editingId
                ? "Update the expense details below."
                : "Enter the details of the new expense."}
            </p>

          </div>

          <button
            type="button"
            className="modal-close"
            onClick={closeForm}
            title="Close"
          >
            <X size={21} />
          </button>

        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <input
              type="text"
              placeholder="Enter expense description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              required
            />

          </div>

          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value,
                )
              }
              required
            >

              <option value="">
                Select category
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}

            </select>

          </div>

          {/* AMOUNT */}

          <div className="form-group">

            <label>
              Amount
            </label>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value,
                )
              }
              required
              min="1"
            />

          </div>

          {/* DATE */}

          <div className="form-group">

            <label>
              Expense Date
            </label>

            <input
              type="date"
              value={expenseDate}
              onChange={(e) =>
                setExpenseDate(
                  e.target.value,
                )
              }
              required
            />

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

            <button
              type="submit"
              className="primary-button"
            >

              {editingId ? (
                <Pencil size={18} />
              ) : (
                <Plus size={19} />
              )}

              {editingId
                ? "Update Expense"
                : "Add Expense"}

            </button>

          </div>

        </form>

      </div>

    </div>
  )}

  {/* =====================================
      HEADER
  ====================================== */}

  <div className="page-header">

    <div>

      <p className="page-label">
        FUND MANAGEMENT
      </p>

      <h1>
        Expenses
      </h1>

      <p className="page-description">
        Track all festival expenses
      </p>

    </div>

    <div className="page-header-actions">

      {/* PRINT */}

      <button
        className="secondary-button"
        onClick={handlePrint}
        title="Print Expenses"
      >

        <Printer size={18} />

        Print

      </button>

      {/* ADMIN ONLY */}

      {user &&
        user.role === "admin" && (
          <button
            className="primary-button"
            onClick={openAddForm}
          >

            <Plus size={19} />

            Add Expense

          </button>
        )}

    </div>

  </div>

  {/* =====================================
      TABLE
  ====================================== */}

  <div className="table-card">

    {/* TOOLBAR */}

    <div className="table-toolbar">

      {/* SEARCH */}

      <div className="search-box">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search expense..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* CATEGORY FILTER */}

      <div className="category-filter">

        <Filter size={17} />

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(
              e.target.value,
            )
          }
        >

          <option value="All">
            All Categories
          </option>

          {categories.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ),
          )}

        </select>

      </div>

      {/* COUNT */}

      <div className="collection-count">
        {filteredExpenses.length}{" "}
        Expenses
      </div>

    </div>

    {/* TABLE */}

    <div className="table-wrapper">

      <table>

        <thead>

          <tr>

            <th>
              Description
            </th>

            <th>
              Category
            </th>

            <th>
              Amount
            </th>

            <th>
              Date
            </th>

            {user &&
              user.role ===
                "admin" && (
                <th>
                  Action
                </th>
              )}

          </tr>

        </thead>

        <tbody>

          {filteredExpenses.length ===
          0 ? (

            <tr>

              <td
                colSpan={
                  user &&
                  user.role ===
                    "admin"
                    ? 5
                    : 4
                }
                className="empty-state"
              >
                No expenses found
              </td>

            </tr>

          ) : (

            filteredExpenses.map(
              (item) => (

                <tr
                  key={item.id}
                >

                  {/* DESCRIPTION */}

                  <td>

                    <div className="person">

                      <div className="person-icon">
                        <Receipt
                          size={17}
                        />
                      </div>

                      <span>
                        {
                          item.description
                        }
                      </span>

                    </div>

                  </td>

                  {/* CATEGORY */}

                  <td>

                    <span className="expense-category">

                      {item.category ||
                        "Other"}

                    </span>

                  </td>

                  {/* AMOUNT */}

                  <td className="amount">

                    ₹
                    {Number(
                      item.amount,
                    ).toLocaleString(
                      "en-IN",
                    )}

                  </td>

                  {/* DATE */}

                  <td>
                    {
                      item.expense_date
                    }
                  </td>

                  {/* ADMIN ACTIONS */}

                  {user &&
                    user.role ===
                      "admin" && (

                      <td>

                        <div className="action-buttons">

                          {/* EDIT */}

                          <button
                            className="edit-button"
                            onClick={() =>
                              openEditForm(
                                item,
                              )
                            }
                            title="Edit Expense"
                          >

                            <Pencil
                              size={16}
                            />

                          </button>

                          {/* DELETE */}

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDeleteExpense(
                                item.id,
                              )
                            }
                            title="Delete Expense"
                          >

                            <Trash2
                              size={16}
                            />

                          </button>

                        </div>

                      </td>

                    )}

                </tr>

              ),
            )

          )}

        </tbody>

      </table>

    </div>

  </div>

</div>


);
}

export default Expenses;
