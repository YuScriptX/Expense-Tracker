let expenses = [];


const addBtn = document.getElementById("addBtn");
const formContainer = document.getElementById("formContainer");
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const balanceSpan = document.getElementById("balance");


addBtn.addEventListener("click", () => {
    if (formContainer.style.display === "none") {
        formContainer.style.display = "block";
    } else {
        formContainer.style.display = "none";
    }
});


function renderExpenses() {
    expenseList.innerHTML = "";
    let total = 0;

    expenses.forEach((e) => {
        total += e.amount;
        const li = document.createElement("li");
        li.textContent = `${e.name} - €${e.amount.toFixed(2)} (${e.category})`;
        expenseList.appendChild(li);
    });

    balanceSpan.textContent = total.toFixed(2);
}


expenseForm.addEventListener("submit", (event) => {
    event.preventDefault(); 

    const nameInput = document.getElementById("name");
    const amountInput = document.getElementById("amount");
    const categoryInput = document.getElementById("category");
    const dateInput = document.getElementById("date");

    const newExpense = {
        name: nameInput.value,
        amount: Number(amountInput.value),
        category: categoryInput.value,
        date: dateInput.value,
    };

    expenses.push(newExpense);

    expenseForm.reset();

    renderExpenses();
});
