const API_URL = "http://127.0.0.1:5000";

// ---------------------------
// 1) STATE
// ---------------------------
let expenses = [];

// ---------------------------
// 2) DOM ELEMENTS
// ---------------------------
const addBtn = document.getElementById("addBtn");
const formContainer = document.getElementById("formContainer");
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const balanceSpan = document.getElementById("balance");

// Inputs
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

// Default date = vandaag
dateInput.valueAsDate = new Date();

// Start: form verborgen
formContainer.style.display = "none";

// ---------------------------
// 3) UI EVENTS
// ---------------------------

// Toggle form open/dicht
addBtn.addEventListener("click", () => {
  formContainer.style.display =
    formContainer.style.display === "none" ? "block" : "none";
});

// Delete (tijdelijk nog lokaal!)
// => In de volgende stap maken we DELETE in de backend.
expenseList.addEventListener("click", (event) => {
  const btn = event.target.closest(".delete-btn");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  expenses = expenses.filter((e) => e.id !== id);
  renderExpenses();
});

// ---------------------------
// 4) RENDER UI
// ---------------------------
function renderExpenses() {
  expenseList.innerHTML = "";
  let total = 0;

  if (expenses.length === 0) {
    expenseList.innerHTML = `<li class="empty">No expenses yet. Add your first one 👇</li>`;
    balanceSpan.textContent = "0.00";
    return;
  }

  expenses.forEach((e) => {
    total += Number(e.amount);

    const li = document.createElement("li");
    li.classList.add("expense-item");

    li.innerHTML = `
      <div class="left">
        <div class="title">${e.name}</div>
        <div class="meta">
          <span class="badge">${e.category}</span>
          <span class="date">${e.date || ""}</span>
        </div>
      </div>
      <div class="right">
        <div class="amount">€${Number(e.amount).toFixed(2)}</div>
        <button class="delete-btn" data-id="${e.id}" aria-label="Delete">✕</button>
      </div>
    `;

    expenseList.appendChild(li);
  });

  balanceSpan.textContent = total.toFixed(2);
}

// ---------------------------
// 5) API CALLS
// ---------------------------

// Load expenses from backend
async function loadExpenses() {
  const res = await fetch(`${API_URL}/expenses`);
  expenses = await res.json();
  renderExpenses();
}

// Save expense to backend
async function saveExpense(newExpense) {
  await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newExpense),
  });
}

// ---------------------------
// 6) FORM SUBMIT
// ---------------------------
expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newExpense = {
    id: Date.now(),
    name: nameInput.value.trim(),
    amount: Number(amountInput.value),
    category: categoryInput.value.trim(),
    date: dateInput.value,
  };

  if (!newExpense.name || !newExpense.category || newExpense.amount <= 0) {
    alert("Please fill in all fields and enter an amount > 0");
    return;
  }

  // 1) Stuur naar backend
  await saveExpense(newExpense);

  // 2) Haal opnieuw op van backend (source of truth)
  await loadExpenses();

  // 3) Reset form + date terug naar vandaag
  expenseForm.reset();
  dateInput.valueAsDate = new Date();

  // 4) Form sluiten
  formContainer.style.display = "none";
});

// ---------------------------
// 7) INIT
// ---------------------------
loadExpenses();
