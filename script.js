// zoom in and out functions (buttons)
// categories for income and expenses
// should chage color of the div box

let incomes = [];
let expenses = [];

function addIncome() {
    const desc = document.getElementById('income-desc').value;
    const amount = document.getElementById('income-amount').value;

    if (desc && amount) {
        incomes.push({ desc, amount: parseFloat(amount) });
        document.getElementById('income-desc').value = '';
        document.getElementById('income-amount').value = '';
        updateIncomeList();
        updateBalance();
    }
}

function addExpense() {
    const desc = document.getElementById('expense-desc').value;
    const amount = document.getElementById('expense-amount').value;

    if (desc && amount) {
        expenses.push({ desc, amount: parseFloat(amount) });
        document.getElementById('expense-desc').value = '';
        document.getElementById('expense-amount').value = '';
        updateExpenseList();
        updateBalance();
    }
}

function setHeight(amount) {
    return Math.min(500, Math.max(5, 155*(amount*1.0/85)));
}

function updateIncomeList() {
    const incomeList = document.getElementById('income-list');
    incomeList.innerHTML = '';
    incomes.forEach(income => {
        const item = document.createElement('div');
        item.classList.add('list-item');
        if (income.amount >= 20) {
            item.innerHTML = `<span>${income.desc}</span>$${income.amount.toFixed(2)}</span>`;
        } else {
            item.innerHTML = `<span>${income.desc}: $${income.amount.toFixed(2)}</span>`;
        }
        
        item.style.height = setHeight(income.amount) + 'px';
        incomeList.appendChild(item);
    });
}

function updateExpenseList() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        const item = document.createElement('div');
        item.classList.add('list-item');
        if (expense.amount >= 20) {
            item.innerHTML = `<span>${expense.desc}</span>$${expense.amount.toFixed(2)}</span>`;
        } else {
            item.innerHTML = `<span>${expense.desc}: $${expense.amount.toFixed(2)}</span>`;
        }
        item.style.height = setHeight(expense.amount) + 'px';
        expenseList.appendChild(item);
    });
}

function updateBalance() {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpense;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
    if (balance < 0) {
        document.getElementById('balance').style.color =  "#ff000d";
        document.getElementById('balance').style.borderColor =  "#ff000d";
    }else{
        // #39ff14
        document.getElementById('balance').style.color =  "#39ff14";
        document.getElementById('balance').style.borderColor =  "#39ff14";
    }
}
