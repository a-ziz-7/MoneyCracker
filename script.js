// script.js

let incomes = [];
let expenses = [];
let contextMenuItem = null;
let resize = [0];
let add = [true];
let custom = [];
// localStorage.setItem('custom', JSON.stringify(["Custom", "Custom 1", "Custom 2", "Custom 3"]));


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
    'custom 1': '#ff3535',
    'custom 2': '#b3aab1',
    'custom 3': '#b4eeb4',
};


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

function ensureCustom(array) {
    if (array === null) {
        array = ["Custom", "Custom 1", "Custom 2", "Custom 3"];
    } 
    return array;
}

// localStorage.clear();
document.addEventListener('DOMContentLoaded', function() {
    // Load income and expenses from localStorage
    const storedIncomes = localStorage.getItem('incomes');
    const storedExpenses = localStorage.getItem('expenses');
    const storedCustom = localStorage.getItem('custom');
    // alert(storedCustom)
    // Parse stored data if available
    if (storedIncomes) {
        incomes = JSON.parse(storedIncomes);
        incomes = ensureAllProperties(incomes);
        updateIncomeList();
    }
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        expenses = ensureAllProperties(expenses);
        updateExpenseList();
    }
    custom = JSON.parse(storedCustom);
    custom = ensureCustom(custom);
    // tcoac();
    console.log(custom);
    // console.log(incomes);
    // console.log(expenses);
});

document.addEventListener('DOMContentLoaded', function(event) {
    tcoac();
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
            const time_info = income.time.substring(0, 5);
            if (income.resize == 0) {
                const height = setHeight(income.amount);
                if (height > 35) {
                    // item.innerHTML = `<span>${income.desc}\t${time_info}</span>$${income.amount.toFixed(2)}</span>`;
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
            time_info = expense.time.substring(0, 5);
            if (expense.resize == 0) {
                const height = setHeight(expense.amount);

            if (height > 35) {
                // item.innerHTML = `<span>${expense.desc}\t${time_info}</span>$${expense.amount.toFixed(2)}</span>`;
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
    contextMenu.style.left = `${event.pageX+5}px`;
    contextMenu.style.top = `${event.pageY-50}px`;
    contextMenuItem = item;
}

function waitForClick() {
    return new Promise((resolve) => {
        document.addEventListener('click', function onClick(event) {
            document.removeEventListener('click', onClick);
            resolve(event);
        });
    });
}

async function lastlast() {
    // document.getElementById('overlay').style.display = 'none';
    const newDesc = document.getElementById('ed').value;
    const newAmount = document.getElementById('ea').value;
    document.getElementById('edir').style.display = 'none';
    if ((newDesc && !isNaN(newAmount)) || newAmount==null) {
        if (tt === 'income') {
            const oldType = beg.type;
            handleOPIncome();   
            await waitForClick();
            await waitForClick();
            let newType = typeIncome !== 'other' ? typeIncome : oldType;
            beg.desc = newDesc;
            beg.amount = newAmount ? parseFloat(newAmount) : beg.amount;
            beg.type = newType
        } else {
            const oldType = beg.type;
            handleOPExpense();  
            await waitForClick();
            await waitForClick(); 
            let newType = typeExpense !== 'other' ? typeExpense : oldType;
            beg.desc = newDesc;
            beg.amount = newAmount ? parseFloat(newAmount) : beg.amount;
            beg.type = newType;
        }
    }
    typeIncome = 'other';
    typeExpense = 'other';
    tcoac();
    update();
    saveData();
}
let tt;
let beg;
async function handleContextAction(action) {
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
        console.log(`INFO:\nTime: ${item.time}\nDescription: ${item.desc}\nAmount: $${item.amount.toFixed(2)}\nType: ${item.type}`);
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('i').innerText = `Info:\nTime: ${item.time}\nDescription: ${item.desc}\nAmount: $${item.amount.toFixed(2)}\nType: ${item.type}`;
        document.getElementById('i').style.display = 'block';
    } else if (action === 'edit') {
        document.getElementById('ed').value = item.desc;
        document.getElementById('ea').value = item.amount;
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('edir').style.display = 'block';
        beg = item;
        tt = type;
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
    if (balance <= 0) {
        document.getElementById('balance').innerText = `$${Math.abs(balance).toFixed(2)}`;
        document.getElementById('balance').style.color =  "#ff000d";
        document.getElementById('balance').style.borderColor =  "#ff000d";
    }else{
        document.getElementById('balance').innerText = `$${balance.toFixed(2)}`;
        document.getElementById('balance').style.color =  "#00ff33";
        document.getElementById('balance').style.borderColor =  "#00ff33";
    }
}

let timeoutId1;
let timeoutId2;

const incomeHeader = document.getElementById("income-header");
const expenseHeader = document.getElementById("expense-header");

incomeHeader.addEventListener('mouseenter', function(event) {
    clearTimeout(timeoutId1);
    incomeHeader.innerText = incomes.reduce((sum, income) => sum + income.amount, 0).toFixed(2);
}, false);

incomeHeader.addEventListener('mouseleave', function(event) {
    timeoutId1 = setTimeout(function() {
        incomeHeader.innerText = "Income";
    }, 2000);
}, false);

// incomeHeader.addEventListener('click', function(event) {
//     clearTimeout(timeoutId1);
//     incomeHeader.innerText = incomes.reduce((sum, income) => sum + income.amount, 0).toFixed(2);
//     setTimeout(function() {
//         incomeHeader.innerText = "Income";
//     }, 5000);
// }, false);

expenseHeader.addEventListener('mouseenter', function(event) {
    clearTimeout(timeoutId2);
    expenseHeader.innerText = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
}, false);

expenseHeader.addEventListener('mouseleave', function(event) {
    timeoutId2 = setTimeout(function() {
        expenseHeader.innerText = "Expenses";
    }, 2000);
}, false);

// expenseHeader.addEventListener('click', function(event) {
//     clearTimeout(timeoutId2);
//     expenseHeader.innerText = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
//     setTimeout(function() {
//         expenseHeader.innerText = "Expenses";
//     }, 5000);
// }, false);


function showAllIncome() {
    incomes.forEach(income => {
        income.hide = false;
    });
    console.log("All Income are shown\nTotal Income: $" + incomes.reduce((sum, income) => sum + income.amount, 0).toFixed(2));
    clearTimeout(timeoutId1);
    incomeHeader.innerText = incomes.reduce((sum, income) => sum + income.amount, 0).toFixed(2);
    setTimeout(function() {
        incomeHeader.innerText = "Income";
    }, 5000);
    update();
    saveData();
}

function showAllExpenses() {
    expenses.forEach(expense => {
        expense.hide = false;
    });
    console.log("All Expenses are shown\nTotal Expense: $" + expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2));
    clearTimeout(timeoutId2);
    expenseHeader.innerText = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
    setTimeout(function() {
        expenseHeader.innerText = "Expenses";
    }, 5000);
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
let expenseTypes = ['food', 'fun', 'shopping', 'groceries', 'transport', 'custom 1', 'custom 2', 'custom 3', 'other'];

document.querySelectorAll('.selectable-option').forEach(function(option) {
    option.addEventListener('click', function() {
        if (incomeTypes.includes(this.getAttribute('data-value'))) {
            typeIncome = this.getAttribute('data-value');
        } else {
            typeExpense = this.getAttribute('data-value');
        }
        if (this.getAttribute('data-value') === 'custom' && this.innerText === 'Custom') {
            o6();
        }
        else if (this.getAttribute('data-value').includes("custom ") && this.innerText.includes("Custom")) {
            o7(this.getAttribute('data-value')[7]);
        } else {
            document.getElementById('overlay').style.display = 'none';
        }
        tcoac();

        document.getElementById('popup').style.display = 'none';
        document.getElementById('popup2').style.display = 'none';
    });
});

function ctp(index) {

    custom[index] = someType;
}

document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup2').style.display = 'none';
    document.getElementById('sorts').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('di').style.display = 'none';
    document.getElementById('de').style.display = 'none';
    document.getElementById('ci').style.display = 'none';
    document.getElementById('ce').style.display = 'none';
    document.getElementById('tpi').style.display = 'none';
    document.getElementById('tpe').style.display = 'none';
    document.getElementById('i').style.display = 'none';
    document.getElementById('ec').style.display = 'none';
    document.getElementById('edir').style.display = 'none';
    tcoac();
});


document.addEventListener('DOMContentLoaded', () => {
    const exMenu = document.getElementById('ex-menu');
    const incomeMenu = document.getElementById('in-menu');

    const dropdownExMenu = exMenu.querySelector('.dropdown-content');
    const dropdownIncomeMenu = incomeMenu.querySelector('.dropdown-content');

    // Function to hide all menus except the specified one
    function hideAllMenus(exceptMenu) {
        if (exceptMenu !== 'exMenu') {
            dropdownExMenu.style.display = 'none';
        }
        if (exceptMenu !== 'incomeMenu') {
            dropdownIncomeMenu.style.display = 'none';
        }
    }

    exMenu.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from propagating to document
        hideAllMenus('exMenu');
        dropdownExMenu.style.display = dropdownExMenu.style.display === 'block' ? 'none' : 'block';
    });

    incomeMenu.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from propagating to document
        hideAllMenus('incomeMenu');
        dropdownIncomeMenu.style.display = dropdownIncomeMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close all menus if clicking outside of any menu
    document.addEventListener('click', () => {
        dropdownExMenu.style.display = 'none';
        dropdownIncomeMenu.style.display = 'none';
    });
});


function incomeTypesInfo() {
    const incomeTypesD = {};

    // Initialize the incomeTypes object with keys from the incomeTypesArray
    incomeTypes.forEach(type => {
        incomeTypesD[type] = 0;
    });

    // Calculate total amounts for each income type
    incomes.forEach(income => {
        if (incomeTypesD.hasOwnProperty(income.type)) {
            incomeTypesD[income.type] += income.amount;
        } else {
            incomeTypesD[income.type] = income.amount; // For any new income types not in the array
        }
    });

    // Build a formatted string to display
    let message = 'Income Types Information:\n\n';
    // console.log(incomeTypesD);
    for (const [type, amount] of Object.entries(incomeTypesD)) {
        let x = type.includes('custom') ? custom[0] : "";
        let xx = (x.includes('Custom') ? "" : ` (${x})`);
        let xxx = xx == " ()" ? "" : xx;
        message += `${type}${xxx}: $${amount.toFixed(2)}\n`;
    }
    console.log(message);

    let container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    // container.style.margin = '20px';

    for (const [type, amount] of Object.entries(incomeTypesD)) {
        let x = type.includes('custom') ? custom[0] : "";
        let xx = (x.includes('Custom') ? "" : ` (${x})`);
        let xxx = xx == " ()" ? "" : xx;

        let typeDiv = document.createElement('div');
        typeDiv.textContent = `${type}${xxx}:`;
        typeDiv.style.flex = '1';
        typeDiv.style.color = type!=='other'? typeColors[type]: "white";

        let amountDiv = document.createElement('div');
        amountDiv.textContent = `$${amount.toFixed(2)}`;
        amountDiv.style.flex = '1';

        let itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.margin = '10px';


        itemDiv.appendChild(typeDiv);
        itemDiv.appendChild(amountDiv);

        container.appendChild(itemDiv);
    }

    let vv = document.getElementById('tpi');
    vv.innerHTML = container.innerHTML;
    vv.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}
// let x = type.includes('custom') ? custom[type[7]] : "";
function expenseTypesInfo() {
    const expenseTypesD = {};

    // Initialize the expenseTypes object with keys from the expenseTypesArray
    expenseTypes.forEach(type => {
        expenseTypesD[type] = 0;
    });

    // Calculate total amounts for each expense type
    expenses.forEach(expense => {
        if (expenseTypesD.hasOwnProperty(expense.type)) {
            expenseTypesD[expense.type] += expense.amount;
        } else {
            expenseTypesD[expense.type] = expense.amount; // For any new expense types not in the array
        }
    });

    // Build a formatted string to display
    let message = 'Expense Types Information:\n\n';
    for (const [type, amount] of Object.entries(expenseTypesD)) {
        let x = type.includes('custom') ? custom[type[7]] : "";
        let xx = (x.includes('Custom') ? "" : ` (${x})`);
        let xxx = xx == " ()" ? "" : xx;
        message += `${type}${xxx}: $${amount.toFixed(2)}\n`;
    }
    console.log(message);

    let container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.margin = '20px';

    for (const [type, amount] of Object.entries(expenseTypesD)) {
        let x = type.includes('custom') ? custom[type[7]] : "";
        let xx = (x.includes('Custom') ? "" : ` (${x})`);
        let xxx = xx == " ()" ? "" : xx;

        let typeDiv = document.createElement('div');
        typeDiv.textContent = `${type}${xxx}:`;
        typeDiv.style.flex = '1';
        typeDiv.style.color = type !== 'other' ? typeColors[type] : "white";

        let amountDiv = document.createElement('div');
        amountDiv.textContent = `$${amount.toFixed(2)}`;
        amountDiv.style.flex = '1';

        let itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.margin = '10px';

        itemDiv.appendChild(typeDiv);
        itemDiv.appendChild(amountDiv);

        container.appendChild(itemDiv);
    }

    let vv = document.getElementById('tpe');
    vv.innerHTML = container.innerHTML;
    vv.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}


function o3() {
    let e = document.getElementById("sorts");
    document.getElementById('overlay').style.display = 'block';
    e.style.display = "block";
}

function updateIncomeListt(incomes) {
    const incomeList = document.getElementById('income-list');
    incomeList.innerHTML = '';
    incomes.forEach(income => {
        if (!income.hide) {
            const item = document.createElement('div');
            item.classList.add('list-item');
            item.dataset.id = income.id;
            item.dataset.type = 'income';
            time_info = income.time.substring(0, 5);
            if (income.resize === 0) {
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
                    item.style.fontSize = item.style.height;
                }
            } else if (income.resize === 1) {
                item.style.height = sizings[1] + 'px';
                item.innerHTML = `<span>${income.desc}</span>$${income.amount.toFixed(2)}</span>`;
            } else if (income.resize === 2) {
                item.style.height = sizings[2] + 'px';
                item.innerHTML = `<span>${income.desc}</span>$${income.amount.toFixed(2)}</span>`;
            }
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

function updateExpenseListt(expenses) {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        if (!expense.hide) {
            const item = document.createElement('div');
            item.classList.add('list-item');
            item.dataset.id = expense.id;
            item.dataset.type = 'expense';
            time_info = expense.time.substring(0, 5);
            if (expense.resize === 0) {
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
                    item.style.fontSize = item.style.height;
                }
            }
            else if (expense.resize === 1) {
                item.style.height = sizings[1] + 'px';
                item.innerHTML = `<span>${expense.desc}</span>$${expense.amount.toFixed(2)}</span>`;
            } else if (expense.resize === 2) {
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
    }
    );
    updateBalance();
}

function sortByAmount(array) {
    return [...array].sort((a, b) => b.amount - a.amount);
}

function sortByAmountDescending(array) {
    return [...array].sort((a, b) => a.amount - b.amount);
}

function sortOrderTypeMain(ari, are) {
    let incomeTypes = ['salary', 'gift', 'business', 'interest', 'custom', 'other'];
    let expenseTypes = ['food', 'fun', 'shopping', 'groceries', 'transport', 'custom 1', 'custom 2', 'custom 3', 'other'];
    let retIncomes = [];
    let retExpenses = [];
    incomeTypes.forEach(item => {
        ari.forEach(income => {
            if (income.type === item) {
                retIncomes.push(income);
            }
        });
    });
    expenseTypes.forEach(item => {
        are.forEach(expense => {
            if (expense.type === item) {
                retExpenses.push(expense);
            }
        });
    });
    return [retIncomes, retExpenses];
}

function orderSort(selectedSort) {
    if (selectedSort === 'sort_3') {
        const sortedIncomes = sortByAmount(incomes);
        const sortedExpenses = sortByAmount(expenses);
        updateIncomeListt(sortedIncomes);
        updateExpenseListt(sortedExpenses);
    } else if (selectedSort === 'sort_4') {
        const sortedIncomes = sortByAmountDescending(incomes);
        const sortedExpenses = sortByAmountDescending(expenses);
        updateIncomeListt(sortedIncomes);
        updateExpenseListt(sortedExpenses);
    } else if (selectedSort === 'sort_1') {
        handleOrder(true);
    } else if (selectedSort === 'sort_2') {
        handleOrder(false);
        add=[true];
    } else if (selectedSort === 'sort_6') {
        const om = sortOrderTypeMain(incomes, expenses);
        const sortedIncomes = om[0];
        const sortedExpenses = om[1];
        updateIncomeListt(sortedIncomes);
        updateExpenseListt(sortedExpenses);
    } else if (selectedSort === 'sort_5') {
        const om = sortOrderTypeMain(incomes, expenses);
        const sortedIncomes = om[0].reverse();
        const sortedExpenses = om[1].reverse();
        updateIncomeListt(sortedIncomes);
        updateExpenseListt(sortedExpenses);
    }
    // saveData();
    // update();
}

document.addEventListener('DOMContentLoaded', () => {
    const sortElements = document.querySelectorAll('.s');

    sortElements.forEach(element => {
        element.addEventListener('click', (event) => {
            const selectedSort = event.target.id;
            document.getElementById('sorts').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
            orderSort(selectedSort);
        });
    });
});

function o4() {
    let e = document.getElementById("di");
    document.getElementById('overlay').style.display = 'block';
    e.style.display = "block";
}

function o5() {
    let e = document.getElementById("de");
    document.getElementById('overlay').style.display = 'block';
    e.style.display = "block";
}

function delI(x) {
    if (x) {
        incomes = [];
        update();
        saveData();
    }
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('di').style.display = 'none';
}

function delE(x) {
    if (x) {
        expenses = [];
        update();
        saveData();
    }
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('de').style.display = 'none';
}  

function o6() {
    let e = document.getElementById("ci");
    document.getElementById('overlay').style.display = 'block';
    e.style.display = "block";
    let ta = document.getElementById('cite');
    ta.focus();
    setTimeout(() => {
        ta.select();
    }, 10); 
}

function o7(x) {
    let e = document.getElementById("ce");
    document.getElementById('overlay').style.display = 'block';
    e.style.display = "block";
    let ta = document.getElementById('cete'+x);
    ta.focus();
    setTimeout(() => {
        ta.select();
    }, 10); 
}

function tcoac() {
    document.getElementById('income_5').innerText = custom[0];
    document.getElementById('expense_11').innerText = custom[1];
    document.getElementById('expense_22').innerText = custom[2];
    document.getElementById('expense_33').innerText = custom[3];
    document.getElementById('cite').innerText = custom[0];
    document.getElementById('cete1').innerText = custom[1];
    document.getElementById('cete2').innerText = custom[2];
    document.getElementById('cete3').innerText = custom[3];
    localStorage.setItem('custom', JSON.stringify(custom));
}

function hc() {
    custom[0] = document.getElementById('cite').value;
    custom[1] = document.getElementById('cete1').value;
    custom[2] = document.getElementById('cete2').value;
    custom[3] = document.getElementById('cete3').value;
    tcoac();
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('ci').style.display = 'none';
    document.getElementById('ce').style.display = 'none';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function o() {
    while (true) {
        console.log(document.getElementById('cite'));
        await sleep(1000);
    }
}
