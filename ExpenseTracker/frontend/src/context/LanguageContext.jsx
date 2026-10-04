import React, {
  createContext,
  useContext,
  useState,
} from "react";

const LanguageContext = createContext(null);

/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  /* =======================================================
     ENGLISH
  ======================================================= */

  English: {
    /* ---------------- COMMON ---------------- */

    brandName: "SpendMate",

    dashboard: "Dashboard",
    expenses: "Expenses",
    income: "Income",
    reports: "Reports",
    budgets: "Budgets",
    savingsGoals: "Savings Goals",
    categories: "Categories",
    profile: "Profile",
    settings: "Settings",
    receiptScanner: "Receipt Scanner",

    mainMenu: "Main Menu",
    account: "Account",
    darkMode: "Dark Mode",
    logout: "Logout",

    notifications: "Notifications",
    search: "Search",
    changeLanguage: "Change Language",

    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    noData: "No data available",
    user: "User",

    /* ---------------- DASHBOARD ---------------- */

    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",

    dashboardSubtitle:
      "Here’s what’s happening with your finances today.",

    availableBalance: "Available balance",
    expensesExceedIncome:
      "Your expenses are higher than your income.",
    fromLastMonth: "from last month",
    overBudget: "over budget",

    monthlyExpenses: "Monthly Expenses",
    spendingOverview: "Spending overview",

    spendingCategories: "Spending Categories",
    thisMonth: "This Month",

    recentTransactions: "Recent Transactions",
    latestExpenses: "Your latest expenses",

    viewAll: "View All",

    noRecentExpenses:
      "No recent expenses found.",

    noCategoryData:
      "No category data available.",

    noMonthlyData:
      "No monthly expense data available.",

    /* ---------------- AUTH ---------------- */

    welcomeBack: "Welcome Back",
    signInContinue:
      "Sign in to continue to SpendMate",

    createAccount: "Create Account",
    startManaging:
      "Start managing your money smarter",

    fullName: "Full Name",
    emailAddress: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",

    signIn: "Sign In",
    createAccountBtn: "Create Account",

    noAccount: "Don't have an account?",
    alreadyAccount:
      "Already have an account?",

    register: "Register",
    login: "Login",

    /* ---------------- EXPENSES ---------------- */

    trackManageSpending:
      "Track and manage your spending",

    addExpense: "Add Expense",

    totalExpenses: "Total Expenses",
    transactions: "Transactions",
    averageSpending: "Average Spending",
    highestExpense: "Highest Expense",

    lastMonth: "Last Month",
    last3Months: "Last 3 Months",
    thisYear: "This Year",

    perTransaction: "Per transaction",

    searchExpenses: "Search expenses...",

    allCategories: "All Categories",
    filters: "Filters",

    allExpenses: "All Expenses",
    transactionsFound:
      "transactions found",

    expense: "Expense",
    category: "Category",
    date: "Date",
    paymentMethod: "Payment Method",
    amount: "Amount",

    sortNewest: "Sort: Newest",

    editExpense: "Edit Expense",
    deleteExpense: "Delete Expense",

    saveExpense: "Save Expense",
    updateExpense: "Update Expense",

    noExpensesFound:
      "No expenses found.",

    expenseNotFound:
      "Expense not found.",

    backToExpenses: "Back to Expenses",

    updateExpenseDetails:
      "Update your expense details",

    expenseTitle: "Expense Title",
    expenseTitleExample:
      "Example: Lunch",

    enterAmount: "Enter amount",

    selectCategory:
      "Select category",

    selectPaymentMethod:
      "Select payment method",

    notes: "Notes",
    notesOptional:
      "Add a note (optional)",

    recordNewExpense:
      "Record a new expense",

    demoExpenseDelete:
      "This is a demo expense. Add your own expense to enable deletion.",

    expenseDeleteConfirm:
      "Are you sure you want to delete this expense?",

    /* ---------------- RECEIPT SCANNER ---------------- */

    scanReceipt: "Scan a Receipt",

    receiptScannerDescription:
      "Upload a receipt and let SpendMate extract the expense details.",

    receiptUploadDescription:
      "Upload a clear photo of your receipt to automatically extract its details.",

    scanning: "Scanning...",
    uploadReceipt: "Upload Receipt",

    readingReceipt:
      "Reading receipt...",

    receiptScanned:
      "Receipt scanned successfully",

    receiptFormats:
      "JPG, PNG or WEBP",

    receiptPreview: "Receipt Preview",

    receiptPreviewEmpty:
      "Your receipt preview will appear here.",

    reviewDetails:
      "Review Extracted Details",

    reviewDetailsDescription:
      "Check the scanned information before saving.",

    detectedReceiptText:
      "Detected Receipt Text",

    noTextDetected:
      "No text detected.",

    saveAsExpense:
      "Save as Expense",

    scanningFailed:
      "Unable to scan this receipt. Please try another clear image.",

    completeMissingDetails:
      "Please complete the missing details before saving.",

    /* ---------------- PAYMENT METHODS ---------------- */

    bankTransfer: "Bank Transfer",
    upi: "UPI",
    cash: "Cash",
    debitCard: "Debit Card",
    creditCard: "Credit Card",
    netBanking: "Net Banking",
    other: "Other",

    /* ---------------- INCOME ---------------- */

    manageEarnings:
      "Manage your earnings",

    addIncome: "Add Income",

    totalIncome: "Total Income",
    averageIncome: "Average Income",
    highestIncome: "Highest Income",

    allIncome: "All Income",

    searchIncome: "Search income...",

    source: "Source",

    editIncome: "Edit Income",
    deleteIncome: "Delete Income",

    saveIncome: "Save Income",
    updateIncome: "Update Income",

    recordedIncome: "Recorded income",
    totalIncomeEntries:
      "Total income entries",
    singleTransaction:
      "Single transaction",

    allSources: "All Sources",

    demoIncomeEdit:
      "This is a demo income. Add your own income to edit it.",

    demoIncomeDelete:
      "This is a demo income. Add your own income to enable deletion.",

    incomeDeleteConfirm:
      "Are you sure you want to delete this income?",

    editIncomeTitle:
      "Edit Income",

    updateIncomeDetails:
      "Update your income details",

    recordNewIncome:
      "Record a new income",

    incomeTitle: "Income Title",

    incomeTitleExample:
      "Example: Monthly Salary",

    selectSource:
      "Select source",

    notesLabel: "Notes",

    noIncomeFound:
      "No income found.",

    /* ---------------- INCOME SOURCES ---------------- */

    salary: "Salary",
    freelance: "Freelance",
    gift: "Gift",
    business: "Business",

    /* ---------------- REPORTS ---------------- */

    reportsTitle:
      "Reports & Analytics",

    understandMoney:
      "Understand where your money is going",

    recordedExpenses:
      "Recorded expenses",

    balance: "Balance",

    incomeMinusExpenses:
      "Income minus expenses",

    topCategory:
      "Top Category",

    spentAmount:
      "{amount} spent",

    expensesByCategory:
      "Expenses by Category",

    categorySpending:
      "Where your money is being spent",

    incomeVsExpenses:
      "Income vs Expenses",

    compareIncomeExpenses:
      "Compare your money coming in and going out",

    spendingTrend:
      "Spending Trend",

    trackExpensesOverTime:
      "Track how your expenses change over time",

    noExpenseData:
      "No expense data available yet.",

    addIncomeExpenses:
      "Add income or expenses to see the chart.",

    addExpensesTrend:
      "Add expenses to see your spending trend.",

    smartInsight:
      "Smart Spending Insight",

    highestCategoryInsight:
      "{category} is currently your highest spending category, with {amount} spent.",

    emptyInsight:
      "Add a few expenses and SpendMate will generate a simple spending insight for you.",

    /* ---------------- BUDGETS ---------------- */

    budgetSubtitle:
      "Set spending limits and stay on track",

    createBudget:
      "Create Budget",

    totalBudget:
      "Total Budget",

    totalSpent:
      "Total Spent",

    remaining:
      "Remaining",

    acrossCategories:
      "Across all categories",

    againstBudgets:
      "Against your budgets",

    availableBudget:
      "Available budget",

    activeBudgets:
      "Active budgets",

    yourBudgets:
      "Your Budgets",

    monitorBudgets:
      "Monitor your spending category by category",

    monthlyBudget:
      "Monthly Budget",

    spent: "Spent",
    limit: "Limit",

    onTrack: "On Track",
    almostReached:
      "Almost Reached",

    budgetExceeded:
      "Budget Exceeded",

    used: "used",
    left: "left",

    createBudgetTitle:
      "Create Budget",

    editBudgetTitle:
      "Edit Budget",

    budgetDescription:
      "Set a monthly spending limit for a category",

    categoryLabel:
      "Category",

    selectCategory:
      "Select category",

    budgetExample:
      "Example: 5000",

    updateBudget:
      "Update Budget",

    createBudgetBtn:
      "Create Budget",

    demoBudgetEdit:
      "This is a demo budget. Create your own budget to edit it.",

    demoBudgetDelete:
      "This is a demo budget. Create your own budget to delete it.",

    confirmDeleteBudget:
      "Are you sure you want to delete this budget?",

    noBudgetsYet:
      "No budgets yet",

    createFirstBudget:
      "Create your first budget to start tracking.",

    /* ---------------- SAVINGS GOALS ---------------- */

    savingsSubtitle:
      "Set targets and track your progress",

    createGoal:
      "Create Goal",

    totalTarget:
      "Total Target",

    totalSaved:
      "Total Saved",

    acrossAllGoals:
      "Across all goals",

    currentSavings:
      "Current savings",

    stillNeeded:
      "Still needed",

    activeGoals:
      "Active goals",

    yourGoals:
      "Your Goals",

    trackGoalProgress:
      "Track your progress towards every target",

    targetDate:
      "Target Date",

    saved: "Saved",
    target: "Target",

    complete: "complete",

    createSavingsGoal:
      "Create Savings Goal",

    editSavingsGoal:
      "Edit Savings Goal",

    goalDescription:
      "Set a target and start tracking your savings",

    goalName: "Goal Name",

    targetAmount:
      "Target Amount",

    currentSavedAmount:
      "Current Saved Amount",

    updateGoal:
      "Update Goal",

    demoGoalEdit:
      "This is a demo goal. Create your own goal to edit it.",

    demoGoalDelete:
      "This is a demo goal. Create your own goal to delete it.",

    savingsGoalDeleteConfirm:
      "Are you sure you want to delete this savings goal?",

    noGoalsYet:
      "No goals yet",

    /* ---------------- CATEGORIES ---------------- */

    categoriesSubtitle:
      "Organize and understand your spending",

    addCategory:
      "Add Category",

    totalCategories:
      "Total Categories",

    customCategories:
      "Custom Categories",

    totalSpending:
      "Total Spending",

    availableCategories:
      "Available categories",

    createdByYou:
      "Created by you",

    acrossAllCategories:
      "Across all categories",

    allCategories:
      "All Categories",

    trackCategorySpending:
      "Track spending category by category",

    defaultCategory:
      "Default category",

    customCategory:
      "Custom category",

    addCategoryTitle:
      "Add Category",

    editCategoryTitle:
      "Edit Category",

    categoryDescription:
      "Create a category to organize your expenses",

    categoryName:
      "Category Name",

    categoryExample:
      "Example: Subscriptions",

    updateCategory:
      "Update Category",

    duplicateCategory:
      "This category already exists.",

    defaultCannotEdit:
      "Default categories cannot be edited. You can create a custom category instead.",

    defaultCannotDelete:
      "Default categories cannot be deleted.",

    categoryHasExpensesConfirm:
      "{category} has {count} expense(s). Delete the category anyway? Existing expenses will keep their current category name.",

    deleteCategoryConfirm:
      "Delete the {category} category?",

    /* ---------------- PROFILE ---------------- */

    manageInformation:
      "Manage your personal information",

    personalInformation:
      "Personal Information",

    updateAccount:
      "Update your account details",

    spendMateUser:
      "SpendMate User",

    saveChanges:
      "Save Changes",

    profileUpdated:
      "Profile updated successfully.",

    enterYourName:
      "Enter your name",

    enterYourEmail:
      "Enter your email",

    noEmailAvailable:
      "No email available",

    /* ---------------- SETTINGS ---------------- */

    customizeExperience:
      "Customize your SpendMate experience",

    language:
      "Language",

    chooseLanguage:
      "Choose your preferred language",

    currency:
      "Currency",

    chooseCurrency:
      "Choose your preferred currency",

    notificationsDescription:
      "Manage your notification preferences",

    saveSettings:
      "Save Settings",

    settingsSaved:
      "Settings saved successfully.",

    /* ---------------- CATEGORIES ---------------- */

    food: "Food",
    shopping: "Shopping",
    travel: "Travel",
    education: "Education",
    entertainment: "Entertainment",
    bills: "Bills",
    health: "Health",
    otherCategory: "Other",

    /* ---------------- MONTHS ---------------- */

    jan: "Jan",
    feb: "Feb",
    mar: "Mar",
    apr: "Apr",
    may: "May",
    jun: "Jun",
    jul: "Jul",
    aug: "Aug",
    sep: "Sep",
    oct: "Oct",
    nov: "Nov",
    dec: "Dec",
newExpenseNotification: "New expense recorded",
newIncomeNotification: "New income recorded",
recentActivity: "Recent activity",
noNotifications: "You're all caught up",
notificationsOff: "Notifications are turned off",
viewAllExpenses: "View all expenses",
    /* ---------------- LANGUAGE SELECTOR ---------------- */

    selectComfortableLanguage:
      "Select your comfortable language",

    comfortableLanguageTelugu:
      "మీకు అనుకూలమైన భాషను ఎంచుకోండి",

    comfortableLanguageHindi:
      "अपनी सुविधानुसार भाषा चुनें",
  },


  /* =======================================================
     TELUGU
  ======================================================= */

  Telugu: {
    /* ---------------- COMMON ---------------- */

    brandName: "స్పెండ్‌మేట్",

    dashboard: "డ్యాష్‌బోర్డ్",
    expenses: "ఖర్చులు",
    income: "ఆదాయం",
    reports: "నివేదికలు",
    budgets: "బడ్జెట్లు",
    savingsGoals: "పొదుపు లక్ష్యాలు",
    categories: "వర్గాలు",
    profile: "ప్రొఫైల్",
    settings: "సెట్టింగ్స్",
    receiptScanner: "రసీదు స్కానర్",

    mainMenu: "ప్రధాన మెనూ",
    account: "ఖాతా",
    darkMode: "డార్క్ మోడ్",
    logout: "లాగ్ అవుట్",

    notifications: "నోటిఫికేషన్స్",
    search: "శోధించండి",
    changeLanguage:
      "భాషను మార్చండి",

    edit: "ఎడిట్",
    delete: "తొలగించండి",
    save: "సేవ్ చేయండి",
    cancel: "రద్దు చేయండి",
    noData: "డేటా అందుబాటులో లేదు",
    user: "వినియోగదారు",

    /* ---------------- DASHBOARD ---------------- */

    goodMorning: "శుభోదయం",
    goodAfternoon: "శుభ మధ్యాహ్నం",
    goodEvening: "శుభ సాయంత్రం",

    dashboardSubtitle:
      "ఈరోజు మీ ఆర్థిక పరిస్థితి ఎలా ఉందో ఇక్కడ చూడండి.",

    availableBalance:
      "అందుబాటులో ఉన్న బ్యాలెన్స్",

    expensesExceedIncome:
      "మీ ఖర్చులు మీ ఆదాయం కంటే ఎక్కువగా ఉన్నాయి.",

    fromLastMonth:
      "గత నెలతో పోలిస్తే",

    overBudget:
      "బడ్జెట్ కంటే ఎక్కువ",

    monthlyExpenses:
      "నెలవారీ ఖర్చులు",

    spendingOverview:
      "ఖర్చుల సమీక్ష",

    spendingCategories:
      "ఖర్చుల వర్గాలు",

    thisMonth:
      "ఈ నెల",

    recentTransactions:
      "ఇటీవలి లావాదేవీలు",

    latestExpenses:
      "మీ తాజా ఖర్చులు",

    viewAll:
      "అన్నీ చూడండి",

    noRecentExpenses:
      "ఇటీవలి ఖర్చులు ఏవీ లేవు.",

    noCategoryData:
      "వర్గాల డేటా అందుబాటులో లేదు.",

    noMonthlyData:
      "నెలవారీ ఖర్చుల డేటా అందుబాటులో లేదు.",

    /* ---------------- AUTH ---------------- */

    welcomeBack:
      "తిరిగి స్వాగతం",

    signInContinue:
      "SpendMate కొనసాగించడానికి సైన్ ఇన్ చేయండి",

    createAccount:
      "ఖాతాను సృష్టించండి",

    startManaging:
      "మీ డబ్బును మరింత స్మార్ట్‌గా నిర్వహించడం ప్రారంభించండి",

    fullName:
      "పూర్తి పేరు",

    emailAddress:
      "ఇమెయిల్ చిరునామా",

    password:
      "పాస్‌వర్డ్",

    confirmPassword:
      "పాస్‌వర్డ్‌ను నిర్ధారించండి",

    signIn:
      "సైన్ ఇన్",

    createAccountBtn:
      "ఖాతాను సృష్టించండి",

    noAccount:
      "ఖాతా లేదా?",

    alreadyAccount:
      "ఇప్పటికే ఖాతా ఉందా?",

    register:
      "రిజిస్టర్",

    login:
      "లాగిన్",

    /* ---------------- EXPENSES ---------------- */

    trackManageSpending:
      "మీ ఖర్చులను ట్రాక్ చేసి నిర్వహించండి",

    addExpense:
      "ఖర్చును జోడించండి",

    totalExpenses:
      "మొత్తం ఖర్చులు",

    transactions:
      "లావాదేవీలు",

    averageSpending:
      "సగటు ఖర్చు",

    highestExpense:
      "అత్యధిక ఖర్చు",

    lastMonth:
      "గత నెల",

    last3Months:
      "గత 3 నెలలు",

    thisYear:
      "ఈ సంవత్సరం",

    perTransaction:
      "ప్రతి లావాదేవీకి",

    searchExpenses:
      "ఖర్చులను శోధించండి...",

    allCategories:
      "అన్ని వర్గాలు",

    filters:
      "ఫిల్టర్లు",

    allExpenses:
      "అన్ని ఖర్చులు",

    transactionsFound:
      "లావాదేవీలు కనుగొనబడ్డాయి",

    expense:
      "ఖర్చు",

    category:
      "వర్గం",

    date:
      "తేదీ",

    paymentMethod:
      "చెల్లింపు విధానం",

    amount:
      "మొత్తం",

    sortNewest:
      "క్రమబద్ధీకరణ: కొత్తవి",

    editExpense:
      "ఖర్చును ఎడిట్ చేయండి",

    deleteExpense:
      "ఖర్చును తొలగించండి",

    saveExpense:
      "ఖర్చును సేవ్ చేయండి",

    updateExpense:
      "ఖర్చును అప్‌డేట్ చేయండి",

    noExpensesFound:
      "ఖర్చులు ఏవీ కనుగొనబడలేదు.",

    expenseNotFound:
      "ఖర్చు కనుగొనబడలేదు.",

    backToExpenses:
      "ఖర్చులకు తిరిగి వెళ్ళండి",

    updateExpenseDetails:
      "మీ ఖర్చు వివరాలను అప్‌డేట్ చేయండి",

    expenseTitle:
      "ఖర్చు పేరు",

    expenseTitleExample:
      "ఉదాహరణ: లంచ్",

    enterAmount:
      "మొత్తాన్ని నమోదు చేయండి",

    selectCategory:
      "వర్గాన్ని ఎంచుకోండి",

    selectPaymentMethod:
      "చెల్లింపు విధానాన్ని ఎంచుకోండి",

    notes:
      "గమనికలు",

    notesOptional:
      "గమనికను జోడించండి (ఐచ్ఛికం)",

    recordNewExpense:
      "కొత్త ఖర్చును నమోదు చేయండి",

    demoExpenseDelete:
      "ఇది డెమో ఖర్చు. తొలగించడానికి మీ స్వంత ఖర్చును జోడించండి.",

    expenseDeleteConfirm:
      "ఈ ఖర్చును తొలగించాలని మీరు ఖచ్చితంగా అనుకుంటున్నారా?",

    /* ---------------- RECEIPT ---------------- */

    scanReceipt:
      "రసీదును స్కాన్ చేయండి",

    receiptScannerDescription:
      "రసీదును అప్‌లోడ్ చేయండి, SpendMate ఖర్చు వివరాలను గుర్తిస్తుంది.",

    receiptUploadDescription:
      "రసీదు వివరాలను ఆటోమేటిక్‌గా గుర్తించడానికి స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి.",

    scanning:
      "స్కాన్ చేస్తోంది...",

    uploadReceipt:
      "రసీదును అప్‌లోడ్ చేయండి",

    readingReceipt:
      "రసీదును చదువుతోంది...",

    receiptScanned:
      "రసీదు విజయవంతంగా స్కాన్ చేయబడింది",

    receiptFormats:
      "JPG, PNG లేదా WEBP",

    receiptPreview:
      "రసీదు ప్రివ్యూ",

    receiptPreviewEmpty:
      "మీ రసీదు ప్రివ్యూ ఇక్కడ కనిపిస్తుంది.",

    reviewDetails:
      "స్కాన్ చేసిన వివరాలను పరిశీలించండి",

    reviewDetailsDescription:
      "సేవ్ చేయడానికి ముందు స్కాన్ చేసిన సమాచారాన్ని తనిఖీ చేయండి.",

    detectedReceiptText:
      "గుర్తించిన రసీదు టెక్స్ట్",

    noTextDetected:
      "టెక్స్ట్ ఏదీ గుర్తించబడలేదు.",

    saveAsExpense:
      "ఖర్చుగా సేవ్ చేయండి",

    scanningFailed:
      "ఈ రసీదును స్కాన్ చేయలేకపోయాము. దయచేసి మరో స్పష్టమైన చిత్రాన్ని ప్రయత్నించండి.",

    completeMissingDetails:
      "సేవ్ చేయడానికి ముందు మిగిలిన వివరాలను పూర్తి చేయండి.",

    /* ---------------- PAYMENT ---------------- */

    bankTransfer:
      "బ్యాంక్ ట్రాన్స్‌ఫర్",

    upi:
      "UPI",

    cash:
      "నగదు",

    debitCard:
      "డెబిట్ కార్డ్",

    creditCard:
      "క్రెడిట్ కార్డ్",

    netBanking:
      "నెట్ బ్యాంకింగ్",

    other:
      "ఇతర",

    /* ---------------- INCOME ---------------- */

    manageEarnings:
      "మీ ఆదాయాన్ని నిర్వహించండి",

    addIncome:
      "ఆదాయాన్ని జోడించండి",

    totalIncome:
      "మొత్తం ఆదాయం",

    averageIncome:
      "సగటు ఆదాయం",

    highestIncome:
      "అత్యధిక ఆదాయం",

    allIncome:
      "అన్ని ఆదాయాలు",

    searchIncome:
      "ఆదాయాన్ని శోధించండి...",

    source:
      "మూలం",

    editIncome:
      "ఆదాయాన్ని ఎడిట్ చేయండి",

    deleteIncome:
      "ఆదాయాన్ని తొలగించండి",

    saveIncome:
      "ఆదాయాన్ని సేవ్ చేయండి",

    updateIncome:
      "ఆదాయాన్ని అప్‌డేట్ చేయండి",

    recordedIncome:
      "నమోదు చేసిన ఆదాయం",

    totalIncomeEntries:
      "మొత్తం ఆదాయ నమోదు",

    singleTransaction:
      "ఒకే లావాదేవీ",

    allSources:
      "అన్ని ఆదాయ వనరులు",

    demoIncomeEdit:
      "ఇది డెమో ఆదాయం. ఎడిట్ చేయడానికి మీ స్వంత ఆదాయాన్ని జోడించండి.",

    demoIncomeDelete:
      "ఇది డెమో ఆదాయం. తొలగించడానికి మీ స్వంత ఆదాయాన్ని జోడించండి.",

    incomeDeleteConfirm:
      "ఈ ఆదాయాన్ని తొలగించాలని మీరు ఖచ్చితంగా అనుకుంటున్నారా?",

    editIncomeTitle:
      "ఆదాయాన్ని ఎడిట్ చేయండి",

    updateIncomeDetails:
      "మీ ఆదాయ వివరాలను అప్‌డేట్ చేయండి",

    recordNewIncome:
      "కొత్త ఆదాయాన్ని నమోదు చేయండి",

    incomeTitle:
      "ఆదాయం పేరు",

    incomeTitleExample:
      "ఉదాహరణ: నెలవారీ జీతం",

    selectSource:
      "ఆదాయ వనరును ఎంచుకోండి",

    notesLabel:
      "గమనికలు",

    noIncomeFound:
      "ఆదాయం ఏదీ కనుగొనబడలేదు.",

    salary:
      "జీతం",

    freelance:
      "ఫ్రీలాన్స్",

    gift:
      "బహుమతి",

    business:
      "వ్యాపారం",

    /* ---------------- REPORTS ---------------- */

    reportsTitle:
      "నివేదికలు & విశ్లేషణ",

    understandMoney:
      "మీ డబ్బు ఎక్కడ ఖర్చవుతుందో అర్థం చేసుకోండి",

    recordedExpenses:
      "నమోదు చేసిన ఖర్చులు",

    balance:
      "బ్యాలెన్స్",

    incomeMinusExpenses:
      "ఆదాయం - ఖర్చులు",

    topCategory:
      "అత్యధిక ఖర్చు వర్గం",

    spentAmount:
      "{amount} ఖర్చు",

    expensesByCategory:
      "వర్గాల వారీగా ఖర్చులు",

    categorySpending:
      "మీ డబ్బు ఎక్కడ ఖర్చవుతుందో ఇక్కడ చూడండి",

    incomeVsExpenses:
      "ఆదాయం vs ఖర్చులు",

    compareIncomeExpenses:
      "వచ్చే మరియు వెళ్లే డబ్బును పోల్చండి",

    spendingTrend:
      "ఖర్చుల ట్రెండ్",

    trackExpensesOverTime:
      "కాలక్రమంలో మీ ఖర్చులు ఎలా మారుతున్నాయో ట్రాక్ చేయండి",

    noExpenseData:
      "ఇంకా ఖర్చుల డేటా అందుబాటులో లేదు.",

    addIncomeExpenses:
      "చార్ట్ చూడటానికి ఆదాయం లేదా ఖర్చులను జోడించండి.",

    addExpensesTrend:
      "ఖర్చుల ట్రెండ్ చూడటానికి ఖర్చులను జోడించండి.",

    smartInsight:
      "స్మార్ట్ ఖర్చుల సూచన",

    highestCategoryInsight:
      "ప్రస్తుతం {category} మీ అత్యధిక ఖర్చు వర్గం. ఇందులో {amount} ఖర్చు చేశారు.",

    emptyInsight:
      "కొన్ని ఖర్చులు జోడించండి. SpendMate మీ కోసం సులభమైన ఖర్చుల సూచనను చూపిస్తుంది.",

    /* ---------------- BUDGETS ---------------- */

    budgetSubtitle:
      "ఖర్చు పరిమితులను సెట్ చేసి బడ్జెట్‌లో ఉండండి",

    createBudget:
      "బడ్జెట్ సృష్టించండి",

    totalBudget:
      "మొత్తం బడ్జెట్",

    totalSpent:
      "మొత్తం ఖర్చు",

    remaining:
      "మిగిలినది",

    acrossCategories:
      "అన్ని వర్గాలపై",

    againstBudgets:
      "మీ బడ్జెట్‌లతో పోలిస్తే",

    availableBudget:
      "అందుబాటులో ఉన్న బడ్జెట్",

    activeBudgets:
      "యాక్టివ్ బడ్జెట్‌లు",

    yourBudgets:
      "మీ బడ్జెట్‌లు",

    monitorBudgets:
      "వర్గాల వారీగా మీ ఖర్చులను పర్యవేక్షించండి",

    monthlyBudget:
      "నెలవారీ బడ్జెట్",

    spent:
      "ఖర్చు",

    limit:
      "పరిమితి",

    onTrack:
      "సరైన స్థాయిలో ఉంది",

    almostReached:
      "దాదాపు చేరుకుంది",

    budgetExceeded:
      "బడ్జెట్ మించిపోయింది",

    used:
      "వాడారు",

    left:
      "మిగిలింది",

    createBudgetTitle:
      "బడ్జెట్ సృష్టించండి",

    editBudgetTitle:
      "బడ్జెట్‌ను ఎడిట్ చేయండి",

    budgetDescription:
      "ఒక వర్గానికి నెలవారీ ఖర్చు పరిమితిని సెట్ చేయండి",

    categoryLabel:
      "వర్గం",

    budgetExample:
      "ఉదాహరణ: 5000",

    updateBudget:
      "బడ్జెట్‌ను అప్‌డేట్ చేయండి",

    createBudgetBtn:
      "బడ్జెట్ సృష్టించండి",

    demoBudgetEdit:
      "ఇది డెమో బడ్జెట్. ఎడిట్ చేయడానికి మీ స్వంత బడ్జెట్‌ను సృష్టించండి.",

    demoBudgetDelete:
      "ఇది డెమో బడ్జెట్. తొలగించడానికి మీ స్వంత బడ్జెట్‌ను సృష్టించండి.",

    confirmDeleteBudget:
      "ఈ బడ్జెట్‌ను తొలగించాలని మీరు ఖచ్చితంగా అనుకుంటున్నారా?",

    noBudgetsYet:
      "ఇంకా బడ్జెట్‌లు లేవు",

    createFirstBudget:
      "ట్రాకింగ్ ప్రారంభించడానికి మీ మొదటి బడ్జెట్‌ను సృష్టించండి.",

    /* ---------------- SAVINGS ---------------- */

    savingsSubtitle:
      "లక్ష్యాలను సెట్ చేసి మీ పురోగతిని ట్రాక్ చేయండి",

    createGoal:
      "లక్ష్యాన్ని సృష్టించండి",

    totalTarget:
      "మొత్తం లక్ష్యం",

    totalSaved:
      "మొత్తం పొదుపు",

    acrossAllGoals:
      "అన్ని లక్ష్యాలపై",

    currentSavings:
      "ప్రస్తుత పొదుపు",

    stillNeeded:
      "ఇంకా అవసరం",

    activeGoals:
      "యాక్టివ్ లక్ష్యాలు",

    yourGoals:
      "మీ లక్ష్యాలు",

    trackGoalProgress:
      "ప్రతి లక్ష్యంపై మీ పురోగతిని ట్రాక్ చేయండి",

    targetDate:
      "లక్ష్య తేదీ",

    saved:
      "పొదుపు",

    target:
      "లక్ష్యం",

    complete:
      "పూర్తి",

    createSavingsGoal:
      "పొదుపు లక్ష్యాన్ని సృష్టించండి",

    editSavingsGoal:
      "పొదుపు లక్ష్యాన్ని ఎడిట్ చేయండి",

    goalDescription:
      "ఒక లక్ష్యాన్ని సెట్ చేసి మీ పొదుపును ట్రాక్ చేయడం ప్రారంభించండి",

    goalName:
      "లక్ష్యం పేరు",

    targetAmount:
      "లక్ష్య మొత్తం",

    currentSavedAmount:
      "ప్రస్తుత పొదుపు మొత్తం",

    updateGoal:
      "లక్ష్యాన్ని అప్‌డేట్ చేయండి",

    demoGoalEdit:
      "ఇది డెమో లక్ష్యం. ఎడిట్ చేయడానికి మీ స్వంత లక్ష్యాన్ని సృష్టించండి.",

    demoGoalDelete:
      "ఇది డెమో లక్ష్యం. తొలగించడానికి మీ స్వంత లక్ష్యాన్ని సృష్టించండి.",

    savingsGoalDeleteConfirm:
      "ఈ పొదుపు లక్ష్యాన్ని తొలగించాలని మీరు ఖచ్చితంగా అనుకుంటున్నారా?",

    noGoalsYet:
      "ఇంకా లక్ష్యాలు లేవు",

    /* ---------------- CATEGORIES ---------------- */

    categoriesSubtitle:
      "మీ ఖర్చులను నిర్వహించి అర్థం చేసుకోండి",

    addCategory:
      "వర్గాన్ని జోడించండి",

    totalCategories:
      "మొత్తం వర్గాలు",

    customCategories:
      "కస్టమ్ వర్గాలు",

    totalSpending:
      "మొత్తం ఖర్చు",

    availableCategories:
      "అందుబాటులో ఉన్న వర్గాలు",

    createdByYou:
      "మీరు సృష్టించినవి",

    acrossAllCategories:
      "అన్ని వర్గాలపై",

    trackCategorySpending:
      "వర్గాల వారీగా ఖర్చులను ట్రాక్ చేయండి",

    defaultCategory:
      "డిఫాల్ట్ వర్గం",

    customCategory:
      "కస్టమ్ వర్గం",

    addCategoryTitle:
      "వర్గాన్ని జోడించండి",

    editCategoryTitle:
      "వర్గాన్ని ఎడిట్ చేయండి",

    categoryDescription:
      "మీ ఖర్చులను నిర్వహించడానికి ఒక వర్గాన్ని సృష్టించండి",

    categoryName:
      "వర్గం పేరు",

    categoryExample:
      "ఉదాహరణ: సబ్‌స్క్రిప్షన్స్",

    updateCategory:
      "వర్గాన్ని అప్‌డేట్ చేయండి",

    duplicateCategory:
      "ఈ వర్గం ఇప్పటికే ఉంది.",

    defaultCannotEdit:
      "డిఫాల్ట్ వర్గాలను ఎడిట్ చేయలేరు. బదులుగా కస్టమ్ వర్గాన్ని సృష్టించండి.",

    defaultCannotDelete:
      "డిఫాల్ట్ వర్గాలను తొలగించలేరు.",

    categoryHasExpensesConfirm:
      "{category}లో {count} ఖర్చులు ఉన్నాయి. అయినప్పటికీ ఈ వర్గాన్ని తొలగించాలా? ఇప్పటికే ఉన్న ఖర్చుల వర్గం పేరు అలాగే ఉంటుంది.",

    deleteCategoryConfirm:
      "{category} వర్గాన్ని తొలగించాలా?",

    /* ---------------- PROFILE ---------------- */

    manageInformation:
      "మీ వ్యక్తిగత సమాచారాన్ని నిర్వహించండి",

    personalInformation:
      "వ్యక్తిగత సమాచారం",

    updateAccount:
      "మీ ఖాతా వివరాలను అప్‌డేట్ చేయండి",

    spendMateUser:
      "SpendMate వినియోగదారు",

    saveChanges:
      "మార్పులను సేవ్ చేయండి",

    profileUpdated:
      "ప్రొఫైల్ విజయవంతంగా అప్‌డేట్ చేయబడింది.",

    enterYourName:
      "మీ పేరును నమోదు చేయండి",

    enterYourEmail:
      "మీ ఇమెయిల్‌ను నమోదు చేయండి",

    noEmailAvailable:
      "ఇమెయిల్ అందుబాటులో లేదు",

    /* ---------------- SETTINGS ---------------- */

    customizeExperience:
      "మీ SpendMate అనుభవాన్ని అనుకూలీకరించండి",

    language:
      "భాష",

    chooseLanguage:
      "మీకు ఇష్టమైన భాషను ఎంచుకోండి",

    currency:
      "కరెన్సీ",

    chooseCurrency:
      "మీకు ఇష్టమైన కరెన్సీని ఎంచుకోండి",

    notificationsDescription:
      "మీ నోటిఫికేషన్ ప్రాధాన్యతలను నిర్వహించండి",

    saveSettings:
      "సెట్టింగ్స్‌ను సేవ్ చేయండి",

    settingsSaved:
      "సెట్టింగ్స్ విజయవంతంగా సేవ్ చేయబడ్డాయి.",

    /* ---------------- CATEGORIES ---------------- */

    food:
      "ఆహారం",

    shopping:
      "షాపింగ్",

    travel:
      "ప్రయాణం",

    education:
      "విద్య",

    entertainment:
      "వినోదం",

    bills:
      "బిల్లులు",

    health:
      "ఆరోగ్యం",

    otherCategory:
      "ఇతర",

    /* ---------------- MONTHS ---------------- */

    jan: "జన",
    feb: "ఫిబ్ర",
    mar: "మార్చి",
    apr: "ఏప్రి",
    may: "మే",
    jun: "జూన్",
    jul: "జూలై",
    aug: "ఆగ",
    sep: "సెప్టెం",
    oct: "అక్టో",
    nov: "నవం",
    dec: "డిసెం",

    newExpenseNotification: "కొత్త ఖర్చు నమోదు చేయబడింది",
newIncomeNotification: "కొత్త ఆదాయం నమోదు చేయబడింది",
recentActivity: "ఇటీవలి కార్యకలాపాలు",
noNotifications: "ప్రస్తుతం కొత్త నోటిఫికేషన్లు లేవు",
notificationsOff: "నోటిఫికేషన్లు ఆఫ్‌లో ఉన్నాయి",
viewAllExpenses: "అన్ని ఖర్చులను చూడండి",

    /* ---------------- LANGUAGE SELECTOR ---------------- */

    selectComfortableLanguage:
      "మీకు అనుకూలమైన భాషను ఎంచుకోండి",

    comfortableLanguageTelugu:
      "మీకు అనుకూలమైన భాషను ఎంచుకోండి",

    comfortableLanguageHindi:
      "మీ సౌకర్యానికి అనుగుణంగా భాషను ఎంచుకోండి",
  },


  /* =======================================================
     HINDI
  ======================================================= */

  Hindi: {
    /* ---------------- COMMON ---------------- */

    brandName: "स्पेंडमेट",

    dashboard: "डैशबोर्ड",
    expenses: "खर्चे",
    income: "आय",
    reports: "रिपोर्ट्स",
    budgets: "बजट",
    savingsGoals: "बचत लक्ष्य",
    categories: "श्रेणियाँ",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    receiptScanner: "रसीद स्कैनर",

    mainMenu: "मुख्य मेनू",
    account: "खाता",
    darkMode: "डार्क मोड",
    logout: "लॉग आउट",

    notifications: "सूचनाएँ",
    search: "खोजें",
    changeLanguage:
      "भाषा बदलें",

    edit: "संपादित करें",
    delete: "हटाएँ",
    save: "सेव करें",
    cancel: "रद्द करें",
    noData: "डेटा उपलब्ध नहीं है",
    user: "उपयोगकर्ता",

    /* ---------------- DASHBOARD ---------------- */

    goodMorning:
      "शुभ प्रभात",

    goodAfternoon:
      "शुभ दोपहर",

    goodEvening:
      "शुभ संध्या",

    dashboardSubtitle:
      "आज आपकी वित्तीय स्थिति कैसी है, यहाँ देखें।",

    availableBalance:
      "उपलब्ध बैलेंस",

    expensesExceedIncome:
      "आपके खर्च आपकी आय से अधिक हैं।",

    fromLastMonth:
      "पिछले महीने से",

    overBudget:
      "बजट से अधिक",

    monthlyExpenses:
      "मासिक खर्च",

    spendingOverview:
      "खर्च का अवलोकन",

    spendingCategories:
      "खर्च की श्रेणियाँ",

    thisMonth:
      "इस महीने",

    recentTransactions:
      "हाल की लेन-देन",

    latestExpenses:
      "आपके हाल के खर्च",

    viewAll:
      "सभी देखें",

    noRecentExpenses:
      "हाल के कोई खर्च नहीं मिले।",

    noCategoryData:
      "श्रेणी का डेटा उपलब्ध नहीं है।",

    noMonthlyData:
      "मासिक खर्च का डेटा उपलब्ध नहीं है।",

    /* ---------------- AUTH ---------------- */

    welcomeBack:
      "वापसी पर स्वागत है",

    signInContinue:
      "SpendMate जारी रखने के लिए साइन इन करें",

    createAccount:
      "खाता बनाएँ",

    startManaging:
      "अपने पैसे को बेहतर तरीके से प्रबंधित करना शुरू करें",

    fullName:
      "पूरा नाम",

    emailAddress:
      "ईमेल पता",

    password:
      "पासवर्ड",

    confirmPassword:
      "पासवर्ड की पुष्टि करें",

    signIn:
      "साइन इन",

    createAccountBtn:
      "खाता बनाएँ",

    noAccount:
      "खाता नहीं है?",

    alreadyAccount:
      "पहले से खाता है?",

    register:
      "रजिस्टर",

    login:
      "लॉगिन",

    /* ---------------- EXPENSES ---------------- */

    trackManageSpending:
      "अपने खर्चों को ट्रैक और प्रबंधित करें",

    addExpense:
      "खर्च जोड़ें",

    totalExpenses:
      "कुल खर्च",

    transactions:
      "लेन-देन",

    averageSpending:
      "औसत खर्च",

    highestExpense:
      "सबसे बड़ा खर्च",

    lastMonth:
      "पिछला महीना",

    last3Months:
      "पिछले 3 महीने",

    thisYear:
      "इस वर्ष",

    perTransaction:
      "प्रति लेन-देन",

    searchExpenses:
      "खर्च खोजें...",

    allCategories:
      "सभी श्रेणियाँ",

    filters:
      "फ़िल्टर",

    allExpenses:
      "सभी खर्च",

    transactionsFound:
      "लेन-देन मिले",

    expense:
      "खर्च",

    category:
      "श्रेणी",

    date:
      "तारीख",

    paymentMethod:
      "भुगतान का तरीका",

    amount:
      "राशि",

    sortNewest:
      "क्रम: नवीनतम",

    editExpense:
      "खर्च संपादित करें",

    deleteExpense:
      "खर्च हटाएँ",

    saveExpense:
      "खर्च सेव करें",

    updateExpense:
      "खर्च अपडेट करें",

    noExpensesFound:
      "कोई खर्च नहीं मिला।",

    expenseNotFound:
      "खर्च नहीं मिला।",

    backToExpenses:
      "खर्चों पर वापस जाएँ",

    updateExpenseDetails:
      "अपने खर्च का विवरण अपडेट करें",

    expenseTitle:
      "खर्च का नाम",

    expenseTitleExample:
      "उदाहरण: लंच",

    enterAmount:
      "राशि दर्ज करें",

    selectCategory:
      "श्रेणी चुनें",

    selectPaymentMethod:
      "भुगतान का तरीका चुनें",

    notes:
      "नोट्स",

    notesOptional:
      "नोट जोड़ें (वैकल्पिक)",

    recordNewExpense:
      "नया खर्च दर्ज करें",

    demoExpenseDelete:
      "यह एक डेमो खर्च है। हटाने के लिए अपना खर्च जोड़ें।",

    expenseDeleteConfirm:
      "क्या आप वाकई इस खर्च को हटाना चाहते हैं?",

    /* ---------------- RECEIPT ---------------- */

    scanReceipt:
      "रसीद स्कैन करें",

    receiptScannerDescription:
      "रसीद अपलोड करें और SpendMate से खर्च का विवरण निकालें।",

    receiptUploadDescription:
      "रसीद का साफ़ फोटो अपलोड करें ताकि उसका विवरण अपने आप निकाला जा सके।",

    scanning:
      "स्कैन हो रहा है...",

    uploadReceipt:
      "रसीद अपलोड करें",

    readingReceipt:
      "रसीद पढ़ी जा रही है...",

    receiptScanned:
      "रसीद सफलतापूर्वक स्कैन की गई",

    receiptFormats:
      "JPG, PNG या WEBP",

    receiptPreview:
      "रसीद प्रीव्यू",

    receiptPreviewEmpty:
      "आपकी रसीद का प्रीव्यू यहाँ दिखाई देगा।",

    reviewDetails:
      "निकाले गए विवरण की समीक्षा करें",

    reviewDetailsDescription:
      "सेव करने से पहले स्कैन की गई जानकारी जाँचें।",

    detectedReceiptText:
      "पहचाना गया रसीद टेक्स्ट",

    noTextDetected:
      "कोई टेक्स्ट नहीं मिला।",

    saveAsExpense:
      "खर्च के रूप में सेव करें",

    scanningFailed:
      "इस रसीद को स्कैन नहीं किया जा सका। कृपया कोई और साफ़ फोटो आज़माएँ।",

    completeMissingDetails:
      "सेव करने से पहले अधूरी जानकारी पूरी करें।",

    /* ---------------- PAYMENT ---------------- */

    bankTransfer:
      "बैंक ट्रांसफर",

    upi:
      "UPI",

    cash:
      "नकद",

    debitCard:
      "डेबिट कार्ड",

    creditCard:
      "क्रेडिट कार्ड",

    netBanking:
      "नेट बैंकिंग",

    other:
      "अन्य",

    /* ---------------- INCOME ---------------- */

    manageEarnings:
      "अपनी आय प्रबंधित करें",

    addIncome:
      "आय जोड़ें",

    totalIncome:
      "कुल आय",

    averageIncome:
      "औसत आय",

    highestIncome:
      "सबसे अधिक आय",

    allIncome:
      "सभी आय",

    searchIncome:
      "आय खोजें...",

    source:
      "स्रोत",

    editIncome:
      "आय संपादित करें",

    deleteIncome:
      "आय हटाएँ",

    saveIncome:
      "आय सेव करें",

    updateIncome:
      "आय अपडेट करें",

    recordedIncome:
      "दर्ज आय",

    totalIncomeEntries:
      "कुल आय प्रविष्टियाँ",

    singleTransaction:
      "एकल लेन-देन",

    allSources:
      "सभी आय स्रोत",

    demoIncomeEdit:
      "यह एक डेमो आय है। संपादित करने के लिए अपनी आय जोड़ें।",

    demoIncomeDelete:
      "यह एक डेमो आय है। हटाने के लिए अपनी आय जोड़ें।",

    incomeDeleteConfirm:
      "क्या आप वाकई इस आय को हटाना चाहते हैं?",

    editIncomeTitle:
      "आय संपादित करें",

    updateIncomeDetails:
      "अपनी आय का विवरण अपडेट करें",

    recordNewIncome:
      "नई आय दर्ज करें",

    incomeTitle:
      "आय का नाम",

    incomeTitleExample:
      "उदाहरण: मासिक वेतन",

    selectSource:
      "आय स्रोत चुनें",

    notesLabel:
      "नोट्स",

    noIncomeFound:
      "कोई आय नहीं मिली।",

    salary:
      "वेतन",

    freelance:
      "फ्रीलांस",

    gift:
      "उपहार",

    business:
      "व्यवसाय",

    /* ---------------- REPORTS ---------------- */

    reportsTitle:
      "रिपोर्ट्स और विश्लेषण",

    understandMoney:
      "समझें कि आपका पैसा कहाँ खर्च हो रहा है",

    recordedExpenses:
      "दर्ज खर्च",

    balance:
      "बैलेंस",

    incomeMinusExpenses:
      "आय - खर्च",

    topCategory:
      "सबसे अधिक खर्च वाली श्रेणी",

    spentAmount:
      "{amount} खर्च",

    expensesByCategory:
      "श्रेणी के अनुसार खर्च",

    categorySpending:
      "देखें आपका पैसा कहाँ खर्च हो रहा है",

    incomeVsExpenses:
      "आय बनाम खर्च",

    compareIncomeExpenses:
      "आने और जाने वाले पैसे की तुलना करें",

    spendingTrend:
      "खर्च का रुझान",

    trackExpensesOverTime:
      "समय के साथ अपने खर्च में बदलाव ट्रैक करें",

    noExpenseData:
      "अभी तक खर्च का डेटा उपलब्ध नहीं है।",

    addIncomeExpenses:
      "चार्ट देखने के लिए आय या खर्च जोड़ें।",

    addExpensesTrend:
      "खर्च का रुझान देखने के लिए खर्च जोड़ें।",

    smartInsight:
      "स्मार्ट खर्च सुझाव",

    highestCategoryInsight:
      "{category} वर्तमान में आपकी सबसे अधिक खर्च वाली श्रेणी है, जिसमें {amount} खर्च हुआ है।",

    emptyInsight:
      "कुछ खर्च जोड़ें और SpendMate आपके लिए एक सरल खर्च सुझाव तैयार करेगा।",

    /* ---------------- BUDGETS ---------------- */

    budgetSubtitle:
      "खर्च की सीमाएँ तय करें और बजट के अनुसार चलें",

    createBudget:
      "बजट बनाएँ",

    totalBudget:
      "कुल बजट",

    totalSpent:
      "कुल खर्च",

    remaining:
      "शेष",

    acrossCategories:
      "सभी श्रेणियों में",

    againstBudgets:
      "आपके बजट के मुकाबले",

    availableBudget:
      "उपलब्ध बजट",

    activeBudgets:
      "सक्रिय बजट",

    yourBudgets:
      "आपके बजट",

    monitorBudgets:
      "श्रेणी के अनुसार अपने खर्च की निगरानी करें",

    monthlyBudget:
      "मासिक बजट",

    spent:
      "खर्च",

    limit:
      "सीमा",

    onTrack:
      "सही स्थिति में",

    almostReached:
      "लगभग पूरा",

    budgetExceeded:
      "बजट पार हो गया",

    used:
      "उपयोग",

    left:
      "बाकी",

    createBudgetTitle:
      "बजट बनाएँ",

    editBudgetTitle:
      "बजट संपादित करें",

    budgetDescription:
      "किसी श्रेणी के लिए मासिक खर्च सीमा तय करें",

    categoryLabel:
      "श्रेणी",

    budgetExample:
      "उदाहरण: 5000",

    updateBudget:
      "बजट अपडेट करें",

    createBudgetBtn:
      "बजट बनाएँ",

    demoBudgetEdit:
      "यह एक डेमो बजट है। संपादित करने के लिए अपना बजट बनाएँ।",

    demoBudgetDelete:
      "यह एक डेमो बजट है। हटाने के लिए अपना बजट बनाएँ।",

    confirmDeleteBudget:
      "क्या आप वाकई इस बजट को हटाना चाहते हैं?",

    noBudgetsYet:
      "अभी कोई बजट नहीं है",

    createFirstBudget:
      "ट्रैकिंग शुरू करने के लिए अपना पहला बजट बनाएँ।",

    /* ---------------- SAVINGS ---------------- */

    savingsSubtitle:
      "लक्ष्य तय करें और अपनी प्रगति ट्रैक करें",

    createGoal:
      "लक्ष्य बनाएँ",

    totalTarget:
      "कुल लक्ष्य",

    totalSaved:
      "कुल बचत",

    acrossAllGoals:
      "सभी लक्ष्यों में",

    currentSavings:
      "वर्तमान बचत",

    stillNeeded:
      "अभी और चाहिए",

    activeGoals:
      "सक्रिय लक्ष्य",

    yourGoals:
      "आपके लक्ष्य",

    trackGoalProgress:
      "हर लक्ष्य की प्रगति ट्रैक करें",

    targetDate:
      "लक्ष्य तारीख",

    saved:
      "बचत",

    target:
      "लक्ष्य",

    complete:
      "पूरा",

    createSavingsGoal:
      "बचत लक्ष्य बनाएँ",

    editSavingsGoal:
      "बचत लक्ष्य संपादित करें",

    goalDescription:
      "एक लक्ष्य तय करें और अपनी बचत ट्रैक करना शुरू करें",

    goalName:
      "लक्ष्य का नाम",

    targetAmount:
      "लक्ष्य राशि",

    currentSavedAmount:
      "वर्तमान बचत राशि",

    updateGoal:
      "लक्ष्य अपडेट करें",

    demoGoalEdit:
      "यह एक डेमो लक्ष्य है। संपादित करने के लिए अपना लक्ष्य बनाएँ।",

    demoGoalDelete:
      "यह एक डेमो लक्ष्य है। हटाने के लिए अपना लक्ष्य बनाएँ।",

    savingsGoalDeleteConfirm:
      "क्या आप वाकई इस बचत लक्ष्य को हटाना चाहते हैं?",

    noGoalsYet:
      "अभी कोई लक्ष्य नहीं है",

    /* ---------------- CATEGORIES ---------------- */

    categoriesSubtitle:
      "अपने खर्चों को व्यवस्थित और समझें",

    addCategory:
      "श्रेणी जोड़ें",

    totalCategories:
      "कुल श्रेणियाँ",

    customCategories:
      "कस्टम श्रेणियाँ",

    totalSpending:
      "कुल खर्च",

    availableCategories:
      "उपलब्ध श्रेणियाँ",

    createdByYou:
      "आपके द्वारा बनाई गई",

    acrossAllCategories:
      "सभी श्रेणियों में",

    trackCategorySpending:
      "श्रेणी के अनुसार खर्च ट्रैक करें",

    defaultCategory:
      "डिफ़ॉल्ट श्रेणी",

    customCategory:
      "कस्टम श्रेणी",

    addCategoryTitle:
      "श्रेणी जोड़ें",

    editCategoryTitle:
      "श्रेणी संपादित करें",

    categoryDescription:
      "अपने खर्चों को व्यवस्थित करने के लिए एक श्रेणी बनाएँ",

    categoryName:
      "श्रेणी का नाम",

    categoryExample:
      "उदाहरण: सब्सक्रिप्शन",

    updateCategory:
      "श्रेणी अपडेट करें",

    duplicateCategory:
      "यह श्रेणी पहले से मौजूद है।",

    defaultCannotEdit:
      "डिफ़ॉल्ट श्रेणियों को संपादित नहीं किया जा सकता। इसके बजाय कस्टम श्रेणी बनाएँ।",

    defaultCannotDelete:
      "डिफ़ॉल्ट श्रेणियों को हटाया नहीं जा सकता।",

    categoryHasExpensesConfirm:
      "{category} में {count} खर्च हैं। क्या फिर भी इस श्रेणी को हटाना चाहते हैं? मौजूदा खर्चों की श्रेणी का नाम वही रहेगा।",

    deleteCategoryConfirm:
      "क्या {category} श्रेणी हटानी है?",

    /* ---------------- PROFILE ---------------- */

    manageInformation:
      "अपनी व्यक्तिगत जानकारी प्रबंधित करें",

    personalInformation:
      "व्यक्तिगत जानकारी",

    updateAccount:
      "अपने खाते का विवरण अपडेट करें",

    spendMateUser:
      "SpendMate उपयोगकर्ता",

    saveChanges:
      "बदलाव सेव करें",

    profileUpdated:
      "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई।",

    enterYourName:
      "अपना नाम दर्ज करें",

    enterYourEmail:
      "अपना ईमेल दर्ज करें",

    noEmailAvailable:
      "ईमेल उपलब्ध नहीं है",

    /* ---------------- SETTINGS ---------------- */

    customizeExperience:
      "अपने SpendMate अनुभव को अनुकूलित करें",

    language:
      "भाषा",

    chooseLanguage:
      "अपनी पसंदीदा भाषा चुनें",

    currency:
      "मुद्रा",

    chooseCurrency:
      "अपनी पसंदीदा मुद्रा चुनें",

    notificationsDescription:
      "अपनी नोटिफिकेशन प्राथमिकताएँ प्रबंधित करें",

    saveSettings:
      "सेटिंग्स सेव करें",

    settingsSaved:
      "सेटिंग्स सफलतापूर्वक सेव की गईं।",

    /* ---------------- CATEGORIES ---------------- */

    food:
      "भोजन",

    shopping:
      "शॉपिंग",

    travel:
      "यात्रा",

    education:
      "शिक्षा",

    entertainment:
      "मनोरंजन",

    bills:
      "बिल",

    health:
      "स्वास्थ्य",

    otherCategory:
      "अन्य",

      newExpenseNotification: "नया खर्च दर्ज किया गया",
newIncomeNotification: "नई आय दर्ज की गई",
recentActivity: "हाल की गतिविधि",
noNotifications: "अभी कोई नई सूचना नहीं है",
notificationsOff: "सूचनाएं बंद हैं",
viewAllExpenses: "सभी खर्च देखें",

    /* ---------------- MONTHS ---------------- */

    jan: "जन",
    feb: "फ़र",
    mar: "मार्च",
    apr: "अप्रैल",
    may: "मई",
    jun: "जून",
    jul: "जुलाई",
    aug: "अग",
    sep: "सितं",
    oct: "अक्टू",
    nov: "नवं",
    dec: "दिसं",

    /* ---------------- LANGUAGE SELECTOR ---------------- */

    selectComfortableLanguage:
      "अपनी सुविधानुसार भाषा चुनें",

    comfortableLanguageTelugu:
      "अपनी सुविधानुसार भाषा चुनें",

    comfortableLanguageHindi:
      "अपनी सुविधानुसार भाषा चुनें",
  },
};


/* =========================================================
   LANGUAGE PROVIDER
========================================================= */

export function LanguageProvider({
  children,
}) {
  const [language, setLanguageState] =
    useState(() => {
      try {
        const settings =
          JSON.parse(
            localStorage.getItem(
              "spendmate_settings"
            )
          ) || {};

        return (
          settings.language ||
          "English"
        );
      } catch {
        return "English";
      }
    });


  const setLanguage = (
    newLanguage
  ) => {
    setLanguageState(
      newLanguage
    );

    try {
      const settings =
        JSON.parse(
          localStorage.getItem(
            "spendmate_settings"
          )
        ) || {};

      localStorage.setItem(
        "spendmate_settings",
        JSON.stringify({
          ...settings,
          language:
            newLanguage,
        })
      );
    } catch {
      // Ignore localStorage errors
    }
  };


  const t = (
    key,
    replacements = {}
  ) => {
    let text =
      translations[
        language
      ]?.[key] ??
      translations.English[
        key
      ] ??
      key;

    Object.entries(
      replacements
    ).forEach(
      ([
        placeholder,
        value,
      ]) => {
        text = text.replace(
          `{${placeholder}}`,
          String(value)
        );
      }
    );

    return text;
  };


  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}


/* =========================================================
   HOOK
========================================================= */

export function useLanguage() {
  const context =
    useContext(
      LanguageContext
    );

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}