const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const list = document.getElementById("list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const toggleBtn = document.getElementById("themeToggle");

let chart;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

/* ADD TRANSACTION */
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  render();

  text.value = "";
  amount.value = "";
});

/* RENDER */
function render() {
  list.innerHTML = "";

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.classList.add(t.amount > 0 ? "plus" : "minus");

    li.innerHTML = `
      ${t.text} <span>₹${Math.abs(t.amount)}</span>
      <button onclick="deleteTransaction(${t.id})">❌</button>
    `;

    list.appendChild(li);
  });

  updateValues();
  updateChart();
}

/* DELETE */
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  render();
}

/* UPDATE VALUES */
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, val) => acc + val, 0);
  const inc = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0);
  const exp = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0);

  balance.innerText = `₹${total}`;
  income.innerText = `₹${inc}`;
  expense.innerText = `₹${Math.abs(exp)}`;
}

/* LOCAL STORAGE */
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* CHART */
function updateChart() {
  const incomeTotal = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const ctx = document.getElementById("chart");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [incomeTotal, Math.abs(expenseTotal)],
        backgroundColor: ["#00c853", "#ff5252"]
      }]
    }
  });
}

/* DARK MODE */
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  toggleBtn.innerText =
    document.body.classList.contains("dark")
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";
});

/* INITIAL LOAD */
render();