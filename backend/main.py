from fastapi import FastAPI, HTTPException
from database import get_db_connection
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.extras import RealDictCursor
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Vinayaka Chaturthi API")


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vinayaka-chaturthi-dj7hxq4np-venulucky1999-byte.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# MODELS
# =========================

class Collection(BaseModel):
    name: str
    amount: float
    collection_date: str


class Expense(BaseModel):
    description: str
    amount: float
    expense_date: str


class LoginRequest(BaseModel):
    username: str
    password: str


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "Vinayaka Chaturthi API is running"
    }


# =========================
# TEST DATABASE
# =========================

@app.get("/api/test-db")
def test_database():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT current_database()")
    result = cursor.fetchone()

    cursor.close()
    connection.close()

    return {
        "database": result[0],
        "status": "Supabase PostgreSQL connection successful"
    }


# =========================
# LOGIN
# =========================

@app.post("/api/login")
def login(request: LoginRequest):

    connection = get_db_connection()

    cursor = connection.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        """
        SELECT id, username, role
        FROM users
        WHERE username = %s AND password = %s
        """,
        (request.username, request.password)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    return {
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "role": user["role"]
        }
    }


# =========================
# GET COLLECTIONS
# =========================

@app.get("/api/collections")
def get_collections():

    connection = get_db_connection()

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    cursor.execute(
        """
        SELECT id, name, amount, collection_date
        FROM collections
        ORDER BY collection_date DESC
        """
    )

    collections = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "collections": collections
    }


# =========================
# ADD COLLECTION
# =========================

@app.post("/api/collections")
def add_collection(collection: Collection):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO collections
        (name, amount, collection_date)
        VALUES (%s, %s, %s)
        """,
        (
            collection.name,
            collection.amount,
            collection.collection_date
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Collection added successfully"
    }


# =========================
# DELETE COLLECTION
# =========================

@app.delete("/api/collections/{collection_id}")
def delete_collection(collection_id: int):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM collections
        WHERE id = %s
        """,
        (collection_id,)
    )

    deleted_rows = cursor.rowcount

    connection.commit()

    cursor.close()
    connection.close()

    if deleted_rows == 0:
        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    return {
        "message": "Collection deleted successfully"
    }


# =========================
# GET EXPENSES
# =========================

@app.get("/api/expenses")
def get_expenses():

    connection = get_db_connection()

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    cursor.execute(
        """
        SELECT
            id,
            description,
            amount,
            expense_date
        FROM expenses
        ORDER BY expense_date DESC
        """
    )

    expenses = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "expenses": expenses
    }


# =========================
# ADD EXPENSE
# =========================

@app.post("/api/expenses")
def add_expense(expense: Expense):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO expenses
        (description, amount, expense_date)
        VALUES (%s, %s, %s)
        """,
        (
            expense.description,
            expense.amount,
            expense.expense_date
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Expense added successfully"
    }


# =========================
# DELETE EXPENSE
# =========================

@app.delete("/api/expenses/{expense_id}")
def delete_expense(expense_id: int):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM expenses
        WHERE id = %s
        """,
        (expense_id,)
    )

    deleted_rows = cursor.rowcount

    connection.commit()

    cursor.close()
    connection.close()

    if deleted_rows == 0:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return {
        "message": "Expense deleted successfully"
    }


# =========================
# DASHBOARD
# =========================

@app.get("/api/dashboard")
def dashboard():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM collections
        """
    )

    total_collection = cursor.fetchone()[0]

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        """
    )

    total_expenditure = cursor.fetchone()[0]

    remaining_balance = total_collection - total_expenditure

    cursor.close()
    connection.close()

    return {
        "total_collection": float(total_collection),
        "total_expenditure": float(total_expenditure),
        "remaining_balance": float(remaining_balance)
    }