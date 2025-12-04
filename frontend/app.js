async function loadExpenses() {
    const res = await fetch("http://127.0.0.1:5000/expenses");
    const data = await res.json();

    const list = document.getElementById("expenseList");
    list.innerHTML = "";

    let total = 0;

    data.forEach(e => {
        total += e.amount;

        list.innerHTML += `<li>${e.name} - €${e.amount} (${e.category})</li>`;
    });

    document.getElementById("balance").textContent = total.toFixed(2);
}

loadExpenses();
