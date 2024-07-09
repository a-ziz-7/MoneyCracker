// script.js

let incomes = [];
let expenses = [];
let contextMenuItem = null;
let resize = [0];
let add = [true];

let sizings = {0:'0', 1:'40', 2:'182.35'};
let typeColors = {
    'salary': '#00b3ff',
    'gift': '#00ff15',
    'business': '#cc00ff',
    'interest': '#ffff00',
    'custom': '#ff9900',
    'other': '#2a2a2a',
    'food': '#ffff00', //
    'transport': '#cc00ff',
    'fun': '#00b3ff',
    'shopping': '#ff9900', //
    'groceries': '#00ff15', // 
    'other': '#2a2a2a', // 
};


// localStorage.clear();
document.addEventListener('DOMContentLoaded', function() {
    // Load income and expenses from localStorage
    const storedIncomes = localStorage.getItem('incomes');
    const storedExpenses = localStorage.getItem('expenses');
    // Parse stored data if available
    if (storedIncomes) {
        incomes = JSON.parse(storedIncomes);
        console.log(incomes);
        updateIncomeList();
    }
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        console.log(expenses);
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


let touchStartTime = 0;
const touchDuration = 400; 

document.addEventListener('touchstart', function(event) {
    if (event.target.classList.contains('list-item')) {
        touchStartTime = Date.now();
    }

    if (event.target.id == "income-header") {
        let el = document.getElementById("income-header");
        setTimeout(function() {
            el.innerText = incomes.reduce((sum, income) => sum + income.amount, 0).toFixed(2);
        }, 2000);
        el.innerText = "Income";
    }

    // do it for expenses
}, false);

document.addEventListener('touchend', function(event) {
    const touchEndTime = Date.now();
    // alert(touchStartTime)
    if (touchEndTime - touchStartTime > touchDuration && event.target.classList.contains('list-item')) {
        // Show context menu for long press
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;
        contextMenuItem = event.target;
        event.preventDefault();
    }
    touchStartTime = 0;
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
        // resize 0 is deafault 1 is small and 2 is big
        const income = { id: Date.now(), time: formattedTime, desc, amount: parseFloat(amount), type: typeIncome, hide: false, resize: 0};
        typeIncome = 'other';
        incomes.push(income);
        // console.log(incomes);
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
        const expense = { id: Date.now(), time: formattedTime, desc, amount: parseFloat(amount), type: typeExpense, hide: false, resize: 0};
        typeExpense = 'other';
        expenses.push(expense);
        document.getElementById('expense-desc').value = '';
        document.getElementById('expense-amount').value = '';
        updateExpenseList();
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
}

function setHeight(amount) {
    // return Math.min(1000, Math.max(5, (155-(resize[0]*15))*(amount*1.0/85)));
    return Math.max(5, (155-(resize[0]*15))*(amount*1.0/85));
}

function updateIncomeList() {
    const incomeList = document.getElementById('income-list');
    incomeList.innerHTML = '';
    incomes.forEach(income => {
        if (!income.hide) {
            const item = document.createElement('div');
            item.classList.add('list-item');
            item.dataset.id = income.id;
            item.dataset.type = 'income';
            if (income.resize == 0) {
                const height = setHeight(income.amount);
                if (height > 35) {
                    item.innerHTML = `<span>${income.desc}</span>$${income.amount.toFixed(2)}</span>`;
                } else {
                    if (income.desc.length < 10 && height > 20) {
                        item.innerHTML = `<span>${income.desc}: $${income.amount.toFixed(2)}</span>`;
                    } else {
                        item.innerHTML = `<span>$${income.amount.toFixed(2)}</span>`;
                    }
                }
                item.style.height = height + 'px';
                if (height < 15) {
                    item.style.fontSize = (item.style.height);
                }
            } else if (income.resize === 1) {
                item.style.height = sizings[1] + 'px';
                item.innerHTML = `<span>${income.desc}</span>$${income.amount.toFixed(2)}</span>`;
            } else if (income.resize == 2) {
                item.style.height = sizings[2] + 'px';
                item.innerHTML = `<span>${income.desc}</span>$${income.amount.toFixed(2)}</span>`;
                
            }
            // workk work work
            item.style.setProperty('--triangle-color', typeColors[income.type]);
            item.addEventListener('contextmenu', function(event) {
                showContextMenu(event, item);
            });
            if (add[0]) {
                incomeList.prepend(item);
            } else {
                incomeList.append(item);
            }
        }
    });
    updateBalance();
}

function updateExpenseList() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        if (!expense.hide) {
            const item = document.createElement('div');
            item.classList.add('list-item');
            item.dataset.id = expense.id;
            item.dataset.type = 'expense';

            if (expense.resize == 0) {
                const height = setHeight(expense.amount);

            if (height > 35) {
                item.innerHTML = `<span>${expense.desc}</span>$${expense.amount.toFixed(2)}</span>`;
            } else {
                if (expense.desc.length < 10 && height > 20) {
                    item.innerHTML = `<span>${expense.desc}: $${expense.amount.toFixed(2)}</span>`;
                } else {
                    item.innerHTML = `<span>$${expense.amount.toFixed(2)}</span>`;
                }
            }
            item.style.height = height + 'px';
            if (height < 15) {
                item.style.fontSize = (item.style.height);
            }
            } else if (expense.resize === 1) {
                item.style.height = sizings[1] + 'px';
                item.innerHTML = `<span>${expense.desc}</span>$${expense.amount.toFixed(2)}</span>`;
            } else if (expense.resize == 2) {
                item.style.height = sizings[2] + 'px';
                item.innerHTML = `<span>${expense.desc}</span>$${expense.amount.toFixed(2)}</span>`;
            }

            item.style.setProperty('--triangle-color', typeColors[expense.type]);
            item.addEventListener('contextmenu', function(event) {
                showContextMenu(event, item);
            });
            if (add[0]) {
                expenseList.prepend(item);
            } else {
                expenseList.append(item);
            }
        }
    });
    updateBalance();
}

function update() {
    updateIncomeList();
    updateExpenseList();
}

function handleOrder(state) {
    add[0] = state;
    update()
}

// handleOrder(true);

function resizeDown() {
    resize[0] += 1;
    update();
}

function resizeUp() {
    resize[0] -= 1;
    update();
}

function showContextMenu(event, item) {
    event.preventDefault();
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY-50}px`;
    contextMenuItem = item;
}

function handleContextAction(action) {
    const id = parseInt(contextMenuItem.dataset.id);
    const type = contextMenuItem.dataset.type;
    const item = type === 'income' ? incomes.find(income => income.id === id) : expenses.find(expense => expense.id === id);
    if (action === 'delete') {
        if (type === 'income') {
            incomes = incomes.filter(income => income.id !== id);
        } else if (type === 'expense') {
            expenses = expenses.filter(expense => expense.id !== id);
        }
    } else if (action === 'info') {
        alert(`INFO:\nTime: ${item.time}\nDescription: ${item.desc}\nAmount: $${item.amount.toFixed(2)}\nType: ${item.type}`);
    } else if (action === 'edit') {
        const newDesc = prompt('Enter new description:', item.desc);
        if (!newDesc) return;
        const newAmount = prompt('Enter new amount:', item.amount);
        // const newType = prompt(`Enter new type: (${incomeTypes.join(', ')})`, item.type);
        // newType = incomeTypes.includes(newType) ? newType : 'other';
        if ((newDesc && !isNaN(newAmount)) || newAmount==null) {
            if (type === 'income') {
                let newType = prompt(`Enter new type: (${incomeTypes.join(', ')})`, item.type);
                newType = incomeTypes.includes(newType) ? newType : 'other';
                const income = incomes.find(income => income.id === id);
                income.desc = newDesc;
                income.amount = newAmount ? parseFloat(newAmount) : income.amount;
                income.type = newType
            } else if (type === 'expense') {
                let newType = prompt(`Enter new type: (${expenseTypes.join(', ')})`, item.type);
                newType = expenseTypes.includes(newType) ? newType : 'other';
                const expense = expenses.find(expense => expense.id === id);
                expense.desc = newDesc;
                expense.amount = newAmount ? parseFloat(newAmount) : expense.amount;
                expense.type = newType;
            }
        }
    } else if (action === 'hide') {
        item.hide = true;
    } else if (action === 'resizesmall') {
        item.resize = 1;
    } else if (action === 'resizebig') {
        item.resize = 2;
    }
    updateBalance();
    saveData();
    update();
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
        document.getElementById('balance').style.color =  "#00ff33";
        document.getElementById('balance').style.borderColor =  "#00ff33";
    }
}

let timeoutId1;
let timeoutId2;

document.getElementById("income-header").addEventListener('mouseenter', function(event) {
    clearTimeout(timeoutId1);
    let el = document.getElementById("income-header");
    el.innerText = incomes.reduce((sum, income) => sum + income.amount, 0).toFixed(2);
}, false);

document.getElementById("income-header").addEventListener('mouseleave', function(event) {
    timeoutId1 = setTimeout(function() {
        let el = document.getElementById("income-header");
        el.innerText = "Income";
    }, 2000);
}, false);

document.getElementById("income-header").addEventListener('click', function(event) {
    clearTimeout(timeoutId1);
}, false);

document.getElementById("expense-header").addEventListener('mouseenter', function(event) {
    clearTimeout(timeoutId2);
    let el = document.getElementById("expense-header");
    el.innerText = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
}, false);

document.getElementById("expense-header").addEventListener('mouseleave', function(event) {
    timeoutId2 = setTimeout(function() {
        let el = document.getElementById("expense-header");
        el.innerText = "Expenses";
    }, 2000);
}, false);

document.getElementById("expense-header").addEventListener('click', function(event) {
    clearTimeout(timeoutId1);
}, false);

document.getElementById("balance").addEventListener("click", function(event) {
    showAllIncome();
    showAllExpenses(); 
    showActualSizesIncomes();
    showActualSizesExpenses();
}, false)


function showAllIncome() {
    incomes.forEach(income => {
        income.hide = false;
    });
    update();
    saveData();
}

function showAllExpenses() {
    expenses.forEach(expense => {
        expense.hide = false;
    });
    update();
    saveData();
}

function showActualSizesIncomes() {
    incomes.forEach(income => {
        income.resize = 0;
    });
    update();
    saveData();
}

function showActualSizesExpenses() {
    expenses.forEach(expense => {
        expense.resize = 0;
    });
    update();
    saveData();
}

function handleOPExpense() {
    document.getElementById('popup2').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function handleOPIncome() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}


let typeIncome = 'other';
let incomeTypes = ['salary', 'gift', 'business', 'interest', 'custom', 'other'];
let typeExpense = 'other';
let expenseTypes = ['food', 'transport', 'fun', 'shopping', 'custom', 'other'];
document.querySelectorAll('.selectable-option').forEach(function(option) {
    option.addEventListener('click', function() {
        if (incomeTypes.includes(this.getAttribute('data-value'))) {
            typeIncome = this.getAttribute('data-value');
        } else {
            typeExpense = this.getAttribute('data-value');
        }
        document.getElementById('popup').style.display = 'none';
        document.getElementById('popup2').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    });
});

document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('popup2').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

function ensureAllProperties(array) {
    const defaultValues = {
        type: 'other',
        hide: false,
        resize: 0
    };

    array.forEach(item => {
        for (const key in defaultValues) {
            if (!item.hasOwnProperty(key)) {
                item[key] = defaultValues[key];
            }
        }
    });

    return array;
}

incomes = ensureAllProperties(incomes);
expenses = ensureAllProperties(expenses);

console.log(incomes);
console.log(expenses);