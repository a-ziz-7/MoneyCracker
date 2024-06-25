// script.js

let incomes = [];
let expenses = [];
let contextMenuItem = null;
let resize = [0];

document.addEventListener('DOMContentLoaded', function() {
    // Load income and expenses from localStorage
    const storedIncomes = localStorage.getItem('incomes');
    const storedExpenses = localStorage.getItem('expenses');

    // Parse stored data if available
    if (storedIncomes) {
        incomes = JSON.parse(storedIncomes);
        updateIncomeList();
    }
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        updateExpenseList();
    }
});

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
}, false);

document.addEventListener('click', function(event) {
    const contextMenu = document.getElementById('context-menu');
    if (event.button !== 2 && contextMenu.style.display === 'block') {
        contextMenu.style.display = 'none';
    }
}, false);

function saveData() {
    localStorage.setItem('incomes', JSON.stringify(incomes));
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function addIncome() {
    const desc = document.getElementById('income-desc').value;
    const amount = document.getElementById('income-amount').value;

    if (desc && amount) {
        let now = new Date();
        let formattedTime = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

        const income = { id: Date.now(), time: formattedTime, desc, amount: parseFloat(amount) };
        incomes.push(income);
        console.log(incomes)
        // fix it later
        document.getElementById('income-desc').value = '';
        document.getElementById('income-amount').value = '';
        updateIncomeList();
        localStorage.setItem('incomes', JSON.stringify(incomes));
    }
}

function addExpense() {
    const desc = document.getElementById('expense-desc').value;
    const amount = document.getElementById('expense-amount').value;

    if (desc && amount) {
        let now = new Date();
        let formattedTime = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        const expense = { id: Date.now(), time: formattedTime, desc, amount: parseFloat(amount) };
        expenses.push(expense);
        document.getElementById('expense-desc').value = '';
        document.getElementById('expense-amount').value = '';
        updateExpenseList();
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
}

function setHeight(amount) {
    console.log(resize)
    return Math.min(1000, Math.max(5, (155-(resize[0]*15))*(amount*1.0/85)));
}

function updateIncomeList() {
    const incomeList = document.getElementById('income-list');
    incomeList.innerHTML = '';
    incomes.forEach(income => {
        const item = document.createElement('div');
        item.classList.add('list-item');
        item.dataset.id = income.id;
        item.dataset.type = 'income';
        if (income.amount >= 20) {
            item.innerHTML = `<span>${income.desc}</span>$${income.amount.toFixed(2)}</span>`;
        } else {
            item.innerHTML = `<span>${income.desc}: $${income.amount.toFixed(2)}</span>`;
        }
        
        item.style.height = setHeight(income.amount) + 'px';
        item.addEventListener('contextmenu', function(event) {
            showContextMenu(event, item);
        });
        incomeList.prepend(item);
    });
    updateBalance();
}

function updateExpenseList() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        const item = document.createElement('div');
        item.classList.add('list-item');
        item.dataset.id = expense.id;
        item.dataset.type = 'expense';
        if (expense.amount >= 20) {
            item.innerHTML = `<span>${expense.desc}</span>$${expense.amount.toFixed(2)}</span>`;
        } else {
            item.innerHTML = `<span>${expense.desc}: $${expense.amount.toFixed(2)}</span>`;
        }
        item.style.height = setHeight(expense.amount) + 'px';
        item.addEventListener('contextmenu', function(event) {
            showContextMenu(event, item);
        });
        expenseList.prepend(item);
    });
    updateBalance();
}

function resizeDown() {
    resize[0] += 1;
    updateIncomeList();
    updateExpenseList();
}

function resizeUp() {
    resize[0] -= 1;
    updateIncomeList();
    updateExpenseList();
}

function showContextMenu(event, item) {
    event.preventDefault();
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenuItem = item;
}

function handleContextAction(action) {
    if (!contextMenuItem) return;

    const id = parseInt(contextMenuItem.dataset.id);
    const type = contextMenuItem.dataset.type;

    if (action === 'delete') {
        if (type === 'income') {
            incomes = incomes.filter(income => income.id !== id);
            updateIncomeList();
            saveData();
        } else if (type === 'expense') {
            expenses = expenses.filter(expense => expense.id !== id);
            updateExpenseList();
            saveData();
        }
    } else if (action === 'info') {
        const item = type === 'income' ? incomes.find(income => income.id === id) : expenses.find(expense => expense.id === id);
        alert(`INFO:\nTime: ${item.time}\nDescription: ${item.desc}\nAmount: $${item.amount.toFixed(2)}`);
    } else if (action === 'edit') {
        const newDesc = prompt('Enter new description:', contextMenuItem.innerText.split(' - ')[0]);
        if (!newDesc) return;
        const newAmount = prompt('Enter new amount:', contextMenuItem.innerText.split(' - $')[1]);

        if (newDesc && newAmount && !isNaN(newAmount)) {
            if (type === 'income') {
                const income = incomes.find(income => income.id === id);
                income.desc = newDesc;
                income.amount = parseFloat(newAmount);
                updateIncomeList();
            } else if (type === 'expense') {
                const expense = expenses.find(expense => expense.id === id);
                expense.desc = newDesc;
                expense.amount = parseFloat(newAmount);
                updateExpenseList();
            }
            updateBalance();
            saveData();
        }
    }
    document.getElementById('context-menu').style.display = 'none';
}

function updateBalance() {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpense;
    document.getElementById('balance').innerText = `$${balance.toFixed(2)}`;
    if (balance <= 0) {
        document.getElementById('balance').style.color =  "#ff000d";
        document.getElementById('balance').style.borderColor =  "#ff000d";
    }else{
        // #39ff14
        document.getElementById('balance').style.color =  "#39ff14";
        document.getElementById('balance').style.borderColor =  "#39ff14";
    }
}