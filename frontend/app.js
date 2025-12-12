// ---------------------------
// 1) STATE (data in memory)
// ---------------------------
let expenses = [];

// ---------------------------
// 2) DOM ELEMENTS (html linken)
// ---------------------------
const addBtn = document.getElementById("addBtn");
const formContainer = document.getElementById("formContainer");
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const balanceSpan = document.getElementById("balance");

// Inputs (handig om 1x te selecteren)
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

// Toggle form (open/dicht)
addBtn.addEventListener("click", () => {
  formContainer.style.display =
    formContainer.style.display === "none" ? "block" : "none";
});

// Delete click (event delegation)
expenseList.addEventListener("click", (event) => {
  const btn = event.target.closest(".delete-btn");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  expenses = expenses.filter((e) => e.id !== id);
  renderExpenses();
});

// ---------------------------
// 4) RENDER FUNCTION (UI tekenen)
// ---------------------------
function renderExpenses() {
  expenseList.innerHTML = "";
  let total = 0;

  // Empty state
  if (expenses.length === 0) {
    expenseList.innerHTML = `<li class="empty">No expenses yet. Add your first one 👇</li>`;
    balanceSpan.textContent = "0.00";
    return;
  }

  // Render expenses
  expenses.forEach((e) => {
    total += e.amount;

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
        <div class="amount">€${e.amount.toFixed(2)}</div>
        <button class="delete-btn" data-id="${e.id}" aria-label="Delete">✕</button>
      </div>
    `;

    expenseList.appendChild(li);
  });

  balanceSpan.textContent = total.toFixed(2);
}

// ---------------------------
// 5) FORM SUBMIT (nieuwe expense)
// ---------------------------
expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Maak nieuw expense object
  const newExpense = {
    id: Date.now(), // nodig voor delete
    name: nameInput.value.trim(),
    amount: Number(amountInput.value),
    category: categoryInput.value.trim(),
    date: dateInput.value,
  };

  // (optioneel) simpele validatie
  if (!newExpense.name || !newExpense.category || newExpense.amount <= 0) {
    alert("Please fill in all fields and enter an amount > 0");
    return;
  }

  // Voeg toe aan array
  expenses.push(newExpense);

  // Update UI
  renderExpenses();

  // Reset form + date terug naar vandaag
  expenseForm.reset();
  dateInput.valueAsDate = new Date();

  // Form sluiten na save (UX polish)
  formContainer.style.display = "none";
});
