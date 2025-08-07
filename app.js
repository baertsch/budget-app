// Budget data
const budgetData = {
    totalBudget: 3000, // Example: 3000 CHF
    startDate: new Date().toISOString().split('T')[0], // Today
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    dailyBudget: 0,
    expenses: {},
    overallBalance: 0
};

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Calculate daily budget
    calculateDailyBudget();
    
    // Load saved data
    loadData();
    
    // Display today's view
    displayToday();
    
    // Set up event listeners
    document.getElementById('add-expense').addEventListener('click', addExpense);
}

function calculateDailyBudget() {
    const start = new Date(budgetData.startDate);
    const end = new Date(budgetData.endDate);
    const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
    budgetData.dailyBudget = budgetData.totalBudget / days;
}

function loadData() {
    const savedData = localStorage.getItem('budgetData');
    if (savedData) {
        Object.assign(budgetData, JSON.parse(savedData));
    }
}

function saveData() {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
}

function displayToday() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('today-date').textContent = today;
    document.getElementById('daily-budget').textContent = budgetData.dailyBudget.toFixed(2);
    
    // Calculate today's balance
    const todayExpenses = budgetData.expenses[today] || [];
    const totalExpenses = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const todayBalance = budgetData.dailyBudget - totalExpenses;
    
    const todayBalanceElement = document.getElementById('today-balance');
    todayBalanceElement.textContent = todayBalance.toFixed(2);
    todayBalanceElement.className = todayBalance >= 0 ? 'positive' : 'negative';
    
    // Display expenses
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    
    todayExpenses.forEach(exp => {
        const item = document.createElement('div');
        item.className = 'expense-item';
        item.innerHTML = `
            <span>${exp.description}</span>
            <span>${exp.amount.toFixed(2)} CHF</span>
        `;
        expenseList.appendChild(item);
    });
    
    // Update overall balance
    updateOverallBalance();
}

function addExpense() {
    const desc = document.getElementById('expense-description').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    
    if (!desc || isNaN(amount)) {
        alert('Please enter both description and amount');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (!budgetData.expenses[today]) {
        budgetData.expenses[today] = [];
    }
    
    budgetData.expenses[today].push({
        description: desc,
        amount: amount,
        date: new Date()
    });
    
    saveData();
    displayToday();
    
    // Clear inputs
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-amount').value = '';
}

function updateOverallBalance() {
    let overall = 0;
    const dates = Object.keys(budgetData.expenses);
    
    dates.forEach(date => {
        const expenses = budgetData.expenses[date];
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        overall += (budgetData.dailyBudget - total);
    });
    
    budgetData.overallBalance = overall;
    const overallElement = document.getElementById('overall-balance');
    overallElement.textContent = overall.toFixed(2);
    overallElement.className = overall >= 0 ? 'positive' : 'negative';
}