document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    const BASE_URL = 'http://localhost:8083';
    let expensesChart = null;
    
    // DOM Elements
    const currentDateElement = document.getElementById('current-date');
    const navLinks = document.querySelectorAll('nav ul li a');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Medicine elements
    const medicinesTable = document.getElementById('medicines-table');
    const medicinesList = document.getElementById('medicines-list');
    const medicineFormContainer = document.getElementById('medicine-form-container');
    const medicineForm = document.getElementById('medicine-form');
    const addMedicineBtn = document.getElementById('add-medicine-btn');
    const cancelMedicineBtn = document.getElementById('cancel-medicine-btn');
    
    // Expense elements
    const expensesTable = document.getElementById('expenses-table');
    const expensesList = document.getElementById('expenses-list');
    const expenseFormContainer = document.getElementById('expense-form-container');
    const expenseForm = document.getElementById('expense-form');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const cancelExpenseBtn = document.getElementById('cancel-expense-btn');
    const expenseMedicineSelect = document.getElementById('expense-medicine');
    
    // Report elements
    const generateReportBtn = document.getElementById('generate-report-btn');
    const reportMonthSelect = document.getElementById('report-month');
    const reportYearInput = document.getElementById('report-year');
    const monthlyExpensesChart = document.getElementById('expensesChart');
    const medicineUsageList = document.getElementById('medicine-usage-list');
    
    // Dashboard elements
    const alertsContainer = document.getElementById('alerts-container');
    const todayMedsContainer = document.getElementById('today-meds-container');
    const lowStockContainer = document.getElementById('low-stock-container');
    const todayExpensesContainer = document.getElementById('today-expenses-container');
    
    // Initialize the app
    function init() {
        setCurrentDate();
        setupEventListeners();
        loadDashboardData();
        loadMedicines();
        loadExpenses();
        loadMedicineOptions();
        
        // Set current year in report
        const currentYear = new Date().getFullYear();
        reportYearInput.value = currentYear;
        
        // Set current month in report (months are 0-indexed in JavaScript)
        const currentMonth = new Date().getMonth() + 1;
        reportMonthSelect.value = currentMonth;
    }
    
    // Set current date in header
    function setCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding section
                contentSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === sectionId) {
                        section.classList.add('active');
                        
                        // Load data when section is shown
                        if (sectionId === 'dashboard') {
                            loadDashboardData();
                        } else if (sectionId === 'medicines') {
                            loadMedicines();
                        } else if (sectionId === 'expenses') {
                            loadExpenses();
                        } else if (sectionId === 'reports') {
                            // Initialize chart when reports section is shown
                            if (!expensesChart) {
                                initChart();
                            }
                        }
                    }
                });
            });
        });
        
        // Medicine form
        addMedicineBtn.addEventListener('click', showMedicineForm);
        cancelMedicineBtn.addEventListener('click', hideMedicineForm);
        medicineForm.addEventListener('submit', handleMedicineSubmit);
        
        // Expense form
        addExpenseBtn.addEventListener('click', showExpenseForm);
        cancelExpenseBtn.addEventListener('click', hideExpenseForm);
        expenseForm.addEventListener('submit', handleExpenseSubmit);
        
        // Reports
        generateReportBtn.addEventListener('click', generateReport);
    }
    
    // Dashboard functions
    function loadDashboardData() {
        fetchTodayMedicines();
        fetchLowStockMedicines();
        fetchAlertMedicines();
        fetchTodayExpenses();
    }
    
    function fetchTodayMedicines() {
        fetch(`${BASE_URL}/medicines/today`)
            .then(response => response.json())
            .then(medicines => {
                todayMedsContainer.innerHTML = '';
                
                if (medicines.length === 0) {
                    todayMedsContainer.innerHTML = '<p>No medicines to take today.</p>';
                    return;
                }
                
                medicines.forEach(medicine => {
                    const medElement = document.createElement('div');
                    medElement.className = 'medicine-item';
                    medElement.innerHTML = `
                        <div>
                            <strong>${medicine.name}</strong> - ${medicine.dosage}
                            ${medicine.timing ? `<span class="badge badge-info">${medicine.timing}</span>` : ''}
                        </div>
                        <button class="btn btn-success btn-sm mark-taken-btn" data-id="${medicine.id}">
                            <i class="fas fa-check"></i> Mark as Taken
                        </button>
                    `;
                    todayMedsContainer.appendChild(medElement);
                });
                
                // Add event listeners to mark as taken buttons
                document.querySelectorAll('.mark-taken-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const medicineId = this.getAttribute('data-id');
                        markMedicineAsTaken(medicineId);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching today medicines:', error);
                todayMedsContainer.innerHTML = '<p class="text-danger">Error loading today\'s medicines.</p>';
            });
    }
    
    function fetchLowStockMedicines() {
        fetch(`${BASE_URL}/medicines/low-stock`)
            .then(response => response.json())
            .then(medicines => {
                lowStockContainer.innerHTML = '';
                
                if (medicines.length === 0) {
                    lowStockContainer.innerHTML = '<p>No low stock medicines.</p>';
                    return;
                }
                
                medicines.forEach(medicine => {
                    const medElement = document.createElement('div');
                    medElement.className = 'medicine-item';
                    medElement.innerHTML = `
                        <div>
                            <strong>${medicine.name}</strong> - ${medicine.dosage}
                        </div>
                        <span class="badge ${medicine.stockCount < 3 ? 'badge-danger' : 'badge-warning'}">
                            Stock: ${medicine.stockCount}
                        </span>
                    `;
                    lowStockContainer.appendChild(medElement);
                });
            })
            .catch(error => {
                console.error('Error fetching low stock medicines:', error);
                lowStockContainer.innerHTML = '<p class="text-danger">Error loading low stock medicines.</p>';
            });
    }
    
    function fetchAlertMedicines() {
        fetch(`${BASE_URL}/medicines/alerts`)
            .then(response => response.json())
            .then(medicines => {
                alertsContainer.innerHTML = '';
                
                if (medicines.length === 0) {
                    alertsContainer.innerHTML = '<p>No alert medicines.</p>';
                    return;
                }
                
                medicines.forEach(medicine => {
                    const medElement = document.createElement('div');
                    medElement.className = 'medicine-item';
                    medElement.innerHTML = `
                        <div>
                            <strong>${medicine.name}</strong> - ${medicine.dosage}
                            ${medicine.timing ? `<span class="badge badge-info">${medicine.timing}</span>` : ''}
                        </div>
                        <button class="btn btn-success btn-sm mark-taken-btn" data-id="${medicine.id}">
                            <i class="fas fa-check"></i> Mark as Taken
                        </button>
                    `;
                    alertsContainer.appendChild(medElement);
                });
                
                // Add event listeners to mark as taken buttons
                document.querySelectorAll('.mark-taken-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const medicineId = this.getAttribute('data-id');
                        markMedicineAsTaken(medicineId);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching alert medicines:', error);
                alertsContainer.innerHTML = '<p class="text-danger">Error loading alert medicines.</p>';
            });
    }
    
    function fetchTodayExpenses() {
        fetch(`${BASE_URL}/expenses/today`)
            .then(response => response.json())
            .then(expenses => {
                todayExpensesContainer.innerHTML = '';
                
                if (expenses.length === 0) {
                    todayExpensesContainer.innerHTML = '<p>No expenses today.</p>';
                    return;
                }
                
                let total = 0;
                expenses.forEach(expense => {
                    const expenseElement = document.createElement('div');
                    expenseElement.className = 'expense-item';
                    expenseElement.innerHTML = `
                        <div>
                            <strong>${expense.medicineName}</strong>
                        </div>
                        <div>
                            $${expense.amount.toFixed(2)}
                        </div>
                    `;
                    todayExpensesContainer.appendChild(expenseElement);
                    total += expense.amount;
                });
                
                // Add total
                const totalElement = document.createElement('div');
                totalElement.className = 'expense-item total';
                totalElement.innerHTML = `
                    <div>
                        <strong>Total</strong>
                    </div>
                    <div>
                        <strong>$${total.toFixed(2)}</strong>
                    </div>
                `;
                todayExpensesContainer.appendChild(totalElement);
            })
            .catch(error => {
                console.error('Error fetching today expenses:', error);
                todayExpensesContainer.innerHTML = '<p class="text-danger">Error loading today\'s expenses.</p>';
            });
    }
    
    // Medicine functions
    function loadMedicines() {
        fetch(`${BASE_URL}/medicines`)
            .then(response => response.json())
            .then(medicines => {
                medicinesList.innerHTML = '';
                
                if (medicines.length === 0) {
                    medicinesList.innerHTML = '<tr><td colspan="7" class="text-center">No medicines found.</td></tr>';
                    return;
                }
                
                medicines.forEach(medicine => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${medicine.name}</td>
                        <td>${medicine.dosage}</td>
                        <td>
                            <span class="badge ${medicine.stockCount < 5 ? (medicine.stockCount < 3 ? 'badge-danger' : 'badge-warning') : 'badge-success'}">
                                ${medicine.stockCount}
                            </span>
                        </td>
                        <td>${medicine.timing || '-'}</td>
                        <td>${medicine.pricePerUnit ? '$' + medicine.pricePerUnit.toFixed(2) : '-'}</td>
                        <td>
                            <span class="badge ${medicine.takenToday ? 'badge-success' : 'badge-secondary'}">
                                ${medicine.takenToday ? 'Yes' : 'No'}
                            </span>
                        </td>
                        <td class="medicine-actions">
                            <button class="btn btn-primary btn-sm edit-medicine-btn" data-id="${medicine.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-medicine-btn" data-id="${medicine.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                            ${!medicine.takenToday ? `
                            <button class="btn btn-success btn-sm mark-taken-btn" data-id="${medicine.id}">
                                <i class="fas fa-check"></i>
                            </button>
                            ` : ''}
                        </td>
                    `;
                    medicinesList.appendChild(row);
                });
                
                // Add event listeners to action buttons
                document.querySelectorAll('.edit-medicine-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const medicineId = this.getAttribute('data-id');
                        editMedicine(medicineId);
                    });
                });
                
                document.querySelectorAll('.delete-medicine-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const medicineId = this.getAttribute('data-id');
                        deleteMedicine(medicineId);
                    });
                });
                
                document.querySelectorAll('.mark-taken-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const medicineId = this.getAttribute('data-id');
                        markMedicineAsTaken(medicineId);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching medicines:', error);
                medicinesList.innerHTML = '<tr><td colspan="7" class="text-center">Error loading medicines.</td></tr>';
            });
    }
    
    function showMedicineForm() {
        medicineForm.reset();
        document.getElementById('medicine-id').value = '';
        medicineFormContainer.style.display = 'block';
    }
    
    function hideMedicineForm() {
        medicineFormContainer.style.display = 'none';
    }
    
    function editMedicine(medicineId) {
        fetch(`${BASE_URL}/medicines/${medicineId}`)
            .then(response => response.json())
            .then(medicine => {
                document.getElementById('medicine-id').value = medicine.id;
                document.getElementById('medicine-name').value = medicine.name;
                document.getElementById('medicine-dosage').value = medicine.dosage;
                document.getElementById('medicine-stock').value = medicine.stockCount;
                document.getElementById('medicine-timing').value = medicine.timing || '';
                document.getElementById('medicine-price').value = medicine.pricePerUnit || '';
                
                medicineFormContainer.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching medicine:', error);
                alert('Error loading medicine data');
            });
    }
    
    function handleMedicineSubmit(e) {
        e.preventDefault();
        
        const medicineId = document.getElementById('medicine-id').value;
        const medicineData = {
            name: document.getElementById('medicine-name').value,
            dosage: document.getElementById('medicine-dosage').value,
            stockCount: parseInt(document.getElementById('medicine-stock').value),
            timing: document.getElementById('medicine-timing').value || null,
            pricePerUnit: parseFloat(document.getElementById('medicine-price').value) || 0
        };
        
        const url = medicineId ? `${BASE_URL}/medicines/${medicineId}` : `${BASE_URL}/medicines`;
        const method = medicineId ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicineData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            hideMedicineForm();
            loadMedicines();
            loadDashboardData(); // Refresh dashboard data
            loadMedicineOptions(); // Refresh medicine options in expense form
        })
        .catch(error => {
            console.error('Error saving medicine:', error);
            alert('Error saving medicine');
        });
    }
    
    function deleteMedicine(medicineId) {
        if (!confirm('Are you sure you want to delete this medicine?')) {
            return;
        }
        
        fetch(`${BASE_URL}/medicines/${medicineId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            loadMedicines();
            loadDashboardData(); // Refresh dashboard data
            loadMedicineOptions(); // Refresh medicine options in expense form
        })
        .catch(error => {
            console.error('Error deleting medicine:', error);
            alert('Error deleting medicine');
        });
    }
    
    function markMedicineAsTaken(medicineId) {
        fetch(`${BASE_URL}/medicines/${medicineId}/taken`, {
            method: 'PUT'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            loadMedicines();
            loadDashboardData(); // Refresh dashboard data
        })
        .catch(error => {
            console.error('Error marking medicine as taken:', error);
            alert('Error marking medicine as taken');
        });
    }
    
    // Expense functions
    function loadExpenses() {
        fetch(`${BASE_URL}/expenses`)
            .then(response => response.json())
            .then(expenses => {
                expensesList.innerHTML = '';
                
                if (expenses.length === 0) {
                    expensesList.innerHTML = '<tr><td colspan="4" class="text-center">No expenses found.</td></tr>';
                    return;
                }
                
                expenses.forEach(expense => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${expense.date}</td>
                        <td>${expense.medicineName}</td>
                        <td>$${expense.amount.toFixed(2)}</td>
                        <td class="expense-actions">
                            <button class="btn btn-primary btn-sm edit-expense-btn" data-id="${expense.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-expense-btn" data-id="${expense.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    expensesList.appendChild(row);
                });
                
                // Add event listeners to action buttons
                document.querySelectorAll('.edit-expense-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const expenseId = this.getAttribute('data-id');
                        editExpense(expenseId);
                    });
                });
                
                document.querySelectorAll('.delete-expense-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const expenseId = this.getAttribute('data-id');
                        deleteExpense(expenseId);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching expenses:', error);
                expensesList.innerHTML = '<tr><td colspan="4" class="text-center">Error loading expenses.</td></tr>';
            });
    }
    
    function loadMedicineOptions() {
        fetch(`${BASE_URL}/medicines`)
            .then(response => response.json())
            .then(medicines => {
                expenseMedicineSelect.innerHTML = '<option value="">Select Medicine</option>';
                
                medicines.forEach(medicine => {
                    const option = document.createElement('option');
                    option.value = medicine.name;
                    option.textContent = medicine.name;
                    expenseMedicineSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching medicines for options:', error);
            });
    }
    
    function showExpenseForm() {
        expenseForm.reset();
        document.getElementById('expense-id').value = '';
        document.getElementById('expense-date').valueAsDate = new Date();
        expenseFormContainer.style.display = 'block';
    }
    
    function hideExpenseForm() {
        expenseFormContainer.style.display = 'none';
    }
    
        function editExpense(expenseId) {
        fetch(`${BASE_URL}/expenses/${expenseId}`)
            .then(response => response.json())
            .then(expense => {
                document.getElementById('expense-id').value = expense.id;
                document.getElementById('expense-date').value = expense.date;
                document.getElementById('expense-medicine').value = expense.medicineName;
                document.getElementById('expense-amount').value = expense.amount;
                
                expenseFormContainer.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching expense:', error);
                alert('Error loading expense data');
            });
    }
    
    function handleExpenseSubmit(e) {
        e.preventDefault();
        
        const expenseId = document.getElementById('expense-id').value;
        const expenseData = {
            date: document.getElementById('expense-date').value,
            medicineName: document.getElementById('expense-medicine').value,
            amount: parseFloat(document.getElementById('expense-amount').value)
        };
        
        const url = expenseId ? `${BASE_URL}/expenses/${expenseId}` : `${BASE_URL}/expenses`;
        const method = expenseId ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            hideExpenseForm();
            loadExpenses();
            loadDashboardData(); // Refresh dashboard data
        })
        .catch(error => {
            console.error('Error saving expense:', error);
            alert('Error saving expense');
        });
    }
    
    function deleteExpense(expenseId) {
        if (!confirm('Are you sure you want to delete this expense?')) {
            return;
        }
        
        fetch(`${BASE_URL}/expenses/${expenseId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            loadExpenses();
            loadDashboardData(); // Refresh dashboard data
        })
        .catch(error => {
            console.error('Error deleting expense:', error);
            alert('Error deleting expense');
        });
    }
    
    // Report functions
    function initChart() {
        const ctx = document.getElementById('expensesChart').getContext('2d');
        expensesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Monthly Expenses',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    }
    
    function generateReport() {
        const month = reportMonthSelect.value;
        const year = reportYearInput.value;
        
        // Fetch monthly expenses
        fetch(`${BASE_URL}/expenses/month/${year}/${month}`)
            .then(response => response.json())
            .then(expenses => {
                // Update chart
                const labels = [];
                const data = [];
                
                // Group expenses by day
                const dailyExpenses = {};
                expenses.forEach(expense => {
                    const date = new Date(expense.date);
                    const day = date.getDate();
                    
                    if (!dailyExpenses[day]) {
                        dailyExpenses[day] = 0;
                    }
                    dailyExpenses[day] += expense.amount;
                });
                
                // Prepare data for chart
                for (let day = 1; day <= 31; day++) {
                    if (dailyExpenses[day]) {
                        labels.push(`${day}/${month}/${year}`);
                        data.push(dailyExpenses[day]);
                    }
                }
                
                // Update chart data
                expensesChart.data.labels = labels;
                expensesChart.data.datasets[0].data = data;
                expensesChart.update();
                
                // Calculate total expenses
                const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
                
                // Update medicine usage list
                const medicineUsage = {};
                expenses.forEach(expense => {
                    if (!medicineUsage[expense.medicineName]) {
                        medicineUsage[expense.medicineName] = 0;
                    }
                    medicineUsage[expense.medicineName] += expense.amount;
                });
                
                // Sort medicines by amount spent
                const sortedMedicines = Object.keys(medicineUsage).sort((a, b) => medicineUsage[b] - medicineUsage[a]);
                
                // Display medicine usage
                medicineUsageList.innerHTML = '';
                
                if (sortedMedicines.length === 0) {
                    medicineUsageList.innerHTML = '<p>No medicine expenses for this period.</p>';
                    return;
                }
                
                const listHeader = document.createElement('div');
                listHeader.className = 'medicine-usage-header';
                listHeader.innerHTML = `
                    <div><strong>Medicine</strong></div>
                    <div><strong>Amount Spent</strong></div>
                    <div><strong>% of Total</strong></div>
                `;
                medicineUsageList.appendChild(listHeader);
                
                sortedMedicines.forEach(medicine => {
                    const amount = medicineUsage[medicine];
                    const percentage = (amount / totalExpenses * 100).toFixed(1);
                    
                    const item = document.createElement('div');
                    item.className = 'medicine-usage-item';
                    item.innerHTML = `
                        <div>${medicine}</div>
                        <div>$${amount.toFixed(2)}</div>
                        <div>${percentage}%</div>
                    `;
                    medicineUsageList.appendChild(item);
                });
                
                // Add total
                const totalItem = document.createElement('div');
                totalItem.className = 'medicine-usage-item total';
                totalItem.innerHTML = `
                    <div><strong>Total</strong></div>
                    <div><strong>$${totalExpenses.toFixed(2)}</strong></div>
                    <div><strong>100%</strong></div>
                `;
                medicineUsageList.appendChild(totalItem);
            })
            .catch(error => {
                console.error('Error generating report:', error);
                alert('Error generating report');
            });
    }
    
    // Track user interactions
    function trackInteraction(medicineId, action) {
        fetch(`${BASE_URL}/medicines/${medicineId}/track?action=${action}`, {
            method: 'POST'
        })
        .catch(error => {
            console.error('Error tracking interaction:', error);
        });
    }
    
    // Initialize the application
    init();
});