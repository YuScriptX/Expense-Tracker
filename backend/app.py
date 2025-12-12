from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Laat je frontend (andere origin) API calls doen tijdens development

# ---------------------------
# In-memory storage (tijdelijk)
# Later vervangen door database (SQLite/SQLAlchemy)
# ---------------------------
expenses = []


# ---------------------------
# Health check (handig om te zien of backend draait)
# ---------------------------
@app.get("/ping")
def ping():
    return jsonify({"message": "OK"}), 200


# ---------------------------
# GET: alle expenses ophalen
# ---------------------------
@app.get("/expenses")
def get_expenses():
    return jsonify(expenses), 200


# ---------------------------
# POST: nieuwe expense toevoegen
# ---------------------------
@app.post("/expenses")
def add_expense():
    data = request.get_json(silent=True)

    # 1) Basic check: is er wel JSON?
    if not data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    # 2) Required fields
    required_fields = ["id", "name", "amount", "category", "date"]
    missing = [f for f in required_fields if f not in data]

    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    # 3) Clean + types
    try:
        new_expense = {
            "id": int(data["id"]),
            "name": str(data["name"]).strip(),
            "amount": float(data["amount"]),
            "category": str(data["category"]).strip(),
            "date": str(data["date"]).strip(),
        }
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data types"}), 400

    # 4) Extra validation
    if not new_expense["name"] or not new_expense["category"] or new_expense["amount"] <= 0:
        return jsonify({"error": "Name/category required and amount must be > 0"}), 400

    expenses.append(new_expense)
    return jsonify(new_expense), 201


# ---------------------------
# Run local dev server
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)
