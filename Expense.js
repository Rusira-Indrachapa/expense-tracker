const today = new Date().toISOString().split('T')[0];
const spendingLimit = 50000;


let transaction = JSON.parse(localStorage.getItem('transactions') || '[]');

if (transaction.length === 0) {
    transaction = [
        { id: 1, date: "2026-06-10", amount: -2500, status: "success", type: "expense", category: "Subscription" },
        { id: 2, date: "2026-06-10", amount: -2500, status: "success", type: "expense", category: "Subscription" },
        { id: 3, date: "2026-06-21", amount: -2500, status: "success", type: "expense", category: "Subscription" }
    ];
}
    
let monthlyincome = Number(localStorage.getItem('monthlyincome')) || 55000;
let monthlyExpense = Number(localStorage.getItem('monthlyExpense')) || 25000;

function openIncomeModal() {
    document.getElementById('incomeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openExpenseModal() {
    document.getElementById('expenseModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';

    if (modalId === 'incomeModal') {
        document.getElementById('incomeForm').reset()
        document.getElementById('incomedate').value = today
    }
    else {
        document.getElementById('expenseForm').reset()
        document.getElementById('expensedate').value = today
    }

}

window.onclick = function (event) {
    const incomeModal = document.getElementById('incomeModal')
    const expenseModal = document.getElementById('expenseModal')

    if (event.target === incomeModal) {
        closeModal('incomeModal')
    }


    if (event.target === expenseModal) {
        closeModal('expenseModal')
    }
}
function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transaction));
    localStorage.setItem('monthlyincome', monthlyincome);
    localStorage.setItem('monthlyExpense', monthlyExpense);
}

function addIncome() {
    const amount = parseFloat(document.getElementById("incomeamount").value)
    const category = document.getElementById("incomecategory").value
    const Description = document.getElementById("incomeDescription").value
    const date = document.getElementById("incomedate").value

    if (!amount || !category || !date) {
        alert('please fill all the requierd  field')
        return
    }
    const newTransactions = {
        id: transaction.length + 1,
        date: date,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: amount,
        status: "success",
        type: "income",
        Description: Description,
    }
    
    transaction.unshift(newTransactions)
    monthlyincome += amount
    updateDashboard()
    updateTransactionsTable()
    closeModal('incomeModal');
    showNotification('income added successfully', 'success')
    saveData();

}


function addExpense() {
    const amount = parseFloat(document.getElementById("expenseamount").value)
    const category = document.getElementById("expensecategory").value
    const Description = document.getElementById("expenseDescription").value
    const date = document.getElementById("expensedate").value

    if (!amount || !category || !date) {
        alert('please fill all the requierd  field')
        return
    }
    const newTransactions = {
        id: transaction.length + 1,
        date: date,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: -amount,
        status: "success",
        type: "expense",
        Description: Description,
    }
    transaction.unshift(newTransactions)
    monthlyExpense += amount
    updateDashboard()
    updateTransactionsTable()
    closeModal('expenseModal');
    showNotification('Expenses added successfully', 'success')
    saveData();

}
function updateHeaderDate() {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    document.getElementById('headerDate').textContent =
        new Date().toLocaleDateString('en-US', options);
}


function exportTransactions() {
    let csv = "Date,Category,Amount,Type\n";

    transaction.forEach(t => {
        csv += `${t.date},${t.category},${t.amount},${t.type}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
}

function updateDashboard() {

    document.querySelector('.income-amount').textContent =
        `${monthlyincome.toLocaleString()}.00`;

    document.querySelector('.expense-amount').textContent =
        `${monthlyExpense.toLocaleString()}.00`;

    const usedAmount = monthlyExpense;
    const percentage = (usedAmount / spendingLimit) * 100;

    document.querySelector('.spending-limit').textContent =
        `Rs ${(spendingLimit - usedAmount).toLocaleString()}/=`;

    document.querySelector('.spending-used').textContent =
        `Used Rs ${usedAmount.toLocaleString()}/= from Rs ${spendingLimit.toLocaleString()}/=`;

    document.querySelector('.progress-fill').style.width =
        `${Math.min(percentage, 100)}%`;
}
function updateTransactionsTable() {
    const tbody = document.querySelector('.transaction-table tbody')
    tbody.innerHTML = ""

    const recentTransactions = transaction.slice(0, 10)

    recentTransactions.forEach((transaction) => {

        const row = document.createElement('tr');
        const formattedDate = new Date(transaction.date).toLocaleDateString(
            'en-Us',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric',


            }
        );
        const amountDisplay = transaction.amount > 0
    ? `+Rs ${transaction.amount.toLocaleString()}.00`
    : `-Rs ${Math.abs(transaction.amount).toLocaleString()}.00`;

        row.innerHTML = `<td>${formattedDate}</td>
                        <td>${transaction.category}</td>
                        <td style="color:${transaction.amount > 0 ? '#10b983' : '#ef4446'}">${amountDisplay}</td>
                        <td><span class="status-success">${transaction.status}</span></td>
                        <td><button class="action-btn"><i class="fas fa-ellipsis-h"></i></button></td>
                        
                        `;
                        tbody.appendChild(row)

    });
}

function showNotification(message, type='success'){
    const notification = document.createElement('div')
    notification.style.cssText=`
     position: fixed;
    top: 2rem;
    right: 2rem;
  padding: 1rem 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
   background:${type === 'success'? '#10b982' :'#ef4444'} ;
    z-index: 1001;
    animation: slideInRight 0.3s ease;
    border-radius: 8px;
    color: #E5E7EB;
    `

    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease'
        setTimeout(() => {
            document.body.removeChild(notification)
        }, 300);
    }, 3000);
    
}

const style= document.createElement('style');
style.textContent =`

@keyframes slideInRight{
    from{
        transform: translateX(100%);
        opacity:0;
    }
    to{
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight{
    from{
        transform: translateX(0);
        opacity:1;
    }
    to{
        transform: translateX(100%);
        opacity: 0;
    }
}

`
document.addEventListener('DOMContentLoaded', function () {



    monthlyincome = Number(localStorage.getItem('monthlyincome')) || 55000;
    monthlyExpense = Number(localStorage.getItem('monthlyExpense')) || 25000;
    updateHeaderDate();
    updateDashboard();
    updateTransactionsTable();
    
});
