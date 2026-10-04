import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  ArrowUp,
  ArrowDown,
  Wallet,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import "../assets/styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  /* =========================================
     USER
  ========================================= */

  const [user, setUser] = useState({});

  /* =========================================
     BACKEND EXPENSES
  ========================================= */

  const [expenses, setExpenses] = useState([]);
  const [expenseLoading, setExpenseLoading] =
    useState(true);
  const [expenseError, setExpenseError] =
    useState("");

  /* =========================================
     LOCAL DATA
     
     Income and budgets are still using
     localStorage for now.
  ========================================= */

  const [income, setIncome] = useState([]);
  const [budgets, setBudgets] = useState([]);

  /* =========================================
     LOAD USER
  ========================================= */

  useEffect(() => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem(
          "spendmate_user"
        )
      );

      setUser(storedUser || {});
    } catch {
      setUser({});
    }
  }, []);

  /* =========================================
     LOAD BACKEND EXPENSES
  ========================================= */

  const loadExpenses = useCallback(
    async () => {
      let currentUser = null;

      try {
        currentUser = JSON.parse(
          localStorage.getItem(
            "spendmate_user"
          )
        );
      } catch {
        currentUser = null;
      }

      if (!currentUser?.id) {
        setExpenses([]);
        setExpenseLoading(false);
        return;
      }

      try {
        setExpenseLoading(true);
        setExpenseError("");

        const response = await fetch(
          `http://localhost:8080/api/expenses?userId=${currentUser.id}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load expenses from the server."
          );
        }

        const data =
          await response.json();

        setExpenses(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Dashboard expense loading error:",
          error
        );

        setExpenses([]);
        setExpenseError(
          "Unable to load expenses. Please check that the backend is running."
        );
      } finally {
        setExpenseLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  /* =========================================
     RELOAD WHEN EXPENSE CHANGES
  ========================================= */

  useEffect(() => {
    const handleExpenseChanged = () => {
      loadExpenses();
    };

    window.addEventListener(
      "expenseChanged",
      handleExpenseChanged
    );

    return () => {
      window.removeEventListener(
        "expenseChanged",
        handleExpenseChanged
      );
    };
  }, [loadExpenses]);

  /* =========================================
     LOAD INCOME
  ========================================= */

  const loadIncome = useCallback(() => {
    try {
      const storedIncome =
        JSON.parse(
          localStorage.getItem(
            "spendmate_income"
          )
        ) || [];

      setIncome(
        Array.isArray(storedIncome)
          ? storedIncome
          : []
      );
    } catch {
      setIncome([]);
    }
  }, []);

  useEffect(() => {
    loadIncome();
  }, [loadIncome]);

  /* =========================================
     RELOAD WHEN INCOME CHANGES
  ========================================= */

  useEffect(() => {
    const handleIncomeChanged = () => {
      loadIncome();
    };

    window.addEventListener(
      "incomeChanged",
      handleIncomeChanged
    );

    return () => {
      window.removeEventListener(
        "incomeChanged",
        handleIncomeChanged
      );
    };
  }, [loadIncome]);

  /* =========================================
     LOAD BUDGETS
  ========================================= */

  const loadBudgets = useCallback(() => {
    try {
      const storedBudgets =
        JSON.parse(
          localStorage.getItem(
            "spendmate_budgets"
          )
        ) || [];

      setBudgets(
        Array.isArray(storedBudgets)
          ? storedBudgets
          : []
      );
    } catch {
      setBudgets([]);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  /* =========================================
     RELOAD WHEN BUDGET CHANGES
  ========================================= */

  useEffect(() => {
    const handleBudgetChanged = () => {
      loadBudgets();
    };

    window.addEventListener(
      "budgetChanged",
      handleBudgetChanged
    );

    return () => {
      window.removeEventListener(
        "budgetChanged",
        handleBudgetChanged
      );
    };
  }, [loadBudgets]);

  /* =========================================
     GREETING
  ========================================= */

  const getGreeting = () => {
    const hour =
      new Date().getHours();

    if (hour < 12) {
      return t("goodMorning");
    }

    if (hour < 17) {
      return t("goodAfternoon");
    }

    return t("goodEvening");
  };

  /* =========================================
     DATE PARSER
  ========================================= */

  const parseDate = useCallback(
    (value) => {
      if (!value) return null;

      if (value instanceof Date) {
        return value;
      }

      const text =
        String(value).trim();

      /*
        Backend date:
        2026-09-18
      */

      const isoMatch =
        text.match(
          /^(\d{4})-(\d{1,2})-(\d{1,2})$/
        );

      if (isoMatch) {
        const year = Number(
          isoMatch[1]
        );

        const month =
          Number(isoMatch[2]) - 1;

        const day = Number(
          isoMatch[3]
        );

        const date = new Date(
          year,
          month,
          day
        );

        return Number.isNaN(
          date.getTime()
        )
          ? null
          : date;
      }

      /*
        Handles:
        18/09/2026
        18-09-2026
      */

      const numericMatch =
        text.match(
          /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
        );

      if (numericMatch) {
        const day = Number(
          numericMatch[1]
        );

        const month =
          Number(
            numericMatch[2]
          ) - 1;

        const year = Number(
          numericMatch[3]
        );

        const date = new Date(
          year,
          month,
          day
        );

        return Number.isNaN(
          date.getTime()
        )
          ? null
          : date;
      }

      const parsed =
        new Date(text);

      if (
        !Number.isNaN(
          parsed.getTime()
        )
      ) {
        return parsed;
      }

      return null;
    },
    []
  );

  /* =========================================
     TOTAL EXPENSES
  ========================================= */

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );
  }, [expenses]);

  /* =========================================
     TOTAL INCOME
  ========================================= */

  const totalIncome = useMemo(() => {
    return income.reduce(
      (sum, item) =>
        sum +
        Number(
          item.amount || 0
        ),
      0
    );
  }, [income]);

  /* =========================================
     CURRENT / PREVIOUS MONTH
  ========================================= */

  const currentMonthData = useMemo(() => {
    const now = new Date();

    return {
      year: now.getFullYear(),
      month: now.getMonth(),
    };
  }, []);

  const previousMonthData = useMemo(() => {
    const now = new Date();

    return {
      year:
        now.getMonth() === 0
          ? now.getFullYear() - 1
          : now.getFullYear(),

      month:
        now.getMonth() === 0
          ? 11
          : now.getMonth() - 1,
    };
  }, []);

  /* =========================================
     CURRENT MONTH EXPENSES
  ========================================= */

  const currentMonthExpenses =
    useMemo(() => {
      return expenses.reduce(
        (sum, expense) => {
          const date =
            parseDate(
              expense.date
            );

          if (!date) {
            return sum;
          }

          const sameMonth =
            date.getFullYear() ===
              currentMonthData.year &&
            date.getMonth() ===
              currentMonthData.month;

          return sameMonth
            ? sum +
                Number(
                  expense.amount || 0
                )
            : sum;
        },
        0
      );
    }, [
      expenses,
      currentMonthData,
      parseDate,
    ]);

  /* =========================================
     PREVIOUS MONTH EXPENSES
  ========================================= */

  const previousMonthExpenses =
    useMemo(() => {
      return expenses.reduce(
        (sum, expense) => {
          const date =
            parseDate(
              expense.date
            );

          if (!date) {
            return sum;
          }

          const sameMonth =
            date.getFullYear() ===
              previousMonthData.year &&
            date.getMonth() ===
              previousMonthData.month;

          return sameMonth
            ? sum +
                Number(
                  expense.amount || 0
                )
            : sum;
        },
        0
      );
    }, [
      expenses,
      previousMonthData,
      parseDate,
    ]);

  /* =========================================
     CURRENT MONTH INCOME
  ========================================= */

  const currentMonthIncome =
    useMemo(() => {
      return income.reduce(
        (sum, item) => {
          const date =
            parseDate(item.date);

          if (!date) {
            return sum;
          }

          const sameMonth =
            date.getFullYear() ===
              currentMonthData.year &&
            date.getMonth() ===
              currentMonthData.month;

          return sameMonth
            ? sum +
                Number(
                  item.amount || 0
                )
            : sum;
        },
        0
      );
    }, [
      income,
      currentMonthData,
      parseDate,
    ]);

  /* =========================================
     PREVIOUS MONTH INCOME
  ========================================= */

  const previousMonthIncome =
    useMemo(() => {
      return income.reduce(
        (sum, item) => {
          const date =
            parseDate(item.date);

          if (!date) {
            return sum;
          }

          const sameMonth =
            date.getFullYear() ===
              previousMonthData.year &&
            date.getMonth() ===
              previousMonthData.month;

          return sameMonth
            ? sum +
                Number(
                  item.amount || 0
                )
            : sum;
        },
        0
      );
    }, [
      income,
      previousMonthData,
      parseDate,
    ]);

  /* =========================================
     PERCENTAGE HELPER
  ========================================= */

  const getMonthComparison = (
    current,
    previous
  ) => {
    current = Number(current || 0);
    previous = Number(previous || 0);

    /*
      No data in either month.
    */

    if (
      current === 0 &&
      previous === 0
    ) {
      return {
        text: t("noData"),
        className: "neutral",
      };
    }

    /*
      Previous month is zero but
      current month has data.
    */

    if (
      previous === 0 &&
      current > 0
    ) {
      return {
        text: `↑ ${t(
          "thisMonth"
        )}`,
        className: "positive",
      };
    }

    const percentage =
      ((current - previous) /
        previous) *
      100;

    const rounded =
      Math.abs(
        Number(
          percentage.toFixed(1)
        )
      );

    if (percentage > 0) {
      return {
        text: `↑ ${rounded}% ${t(
          "fromLastMonth"
        )}`,
        className: "positive",
      };
    }

    if (percentage < 0) {
      return {
        text: `↓ ${rounded}% ${t(
          "fromLastMonth"
        )}`,
        className: "negative",
      };
    }

    return {
      text: `→ 0% ${t(
        "fromLastMonth"
      )}`,
      className: "neutral",
    };
  };

  /* =========================================
     INCOME MONTH COMPARISON
  ========================================= */

  const incomeComparison =
    useMemo(() => {
      return getMonthComparison(
        currentMonthIncome,
        previousMonthIncome
      );
    }, [
      currentMonthIncome,
      previousMonthIncome,
    ]);

  /* =========================================
     EXPENSE MONTH COMPARISON
  ========================================= */

  const expenseComparison =
    useMemo(() => {
      return getMonthComparison(
        currentMonthExpenses,
        previousMonthExpenses
      );
    }, [
      currentMonthExpenses,
      previousMonthExpenses,
    ]);

  /* =========================================
     BALANCE
  ========================================= */

  const balance =
    totalIncome - totalExpenses;

  /* =========================================
     TOTAL BUDGET
  ========================================= */

  const totalBudget = useMemo(() => {
    return budgets.reduce(
      (sum, budget) =>
        sum +
        Number(
          budget.limit || 0
        ),
      0
    );
  }, [budgets]);

  /* =========================================
     BUDGET PERCENTAGE
  ========================================= */

  const budgetPercentage =
    totalBudget > 0
      ? Math.min(
          Math.round(
            (totalExpenses /
              totalBudget) *
              100
          ),
          100
        )
      : 0;

  const budgetRemaining =
    totalBudget - totalExpenses;

  /* =========================================
     CATEGORY DATA
  ========================================= */

  const categoryData = useMemo(() => {
    const totals = {};

    expenses.forEach(
      (expense) => {
        const category =
          expense.category ||
          "Other";

        totals[category] =
          (totals[category] || 0) +
          Number(
            expense.amount || 0
          );
      }
    );

    return Object.entries(
      totals
    )
      .map(
        ([name, value]) => ({
          name,
          value,
        })
      )
      .sort(
        (a, b) =>
          b.value - a.value
      );
  }, [expenses]);

  /* =========================================
     CATEGORY TRANSLATION
  ========================================= */

  const getCategoryLabel = (
    category
  ) => {
    const categoryKeys = {
      Food: "food",
      Shopping: "shopping",
      Travel: "travel",
      Education: "education",
      Entertainment:
        "entertainment",
      Bills: "bills",
      Health: "health",
      Other: "otherCategory",
    };

    return t(
      categoryKeys[category] ||
        "otherCategory"
    );
  };

  /* =========================================
     MONTHLY DATA
  ========================================= */

  const monthlyData = useMemo(() => {
    const months = {};

    expenses.forEach(
      (expense) => {
        const date =
          parseDate(
            expense.date
          );

        if (!date) {
          return;
        }

        const month =
          date.toLocaleString(
            "en-US",
            {
              month: "short",
            }
          );

        const year =
          date.getFullYear();

        const key = `${year}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!months[key]) {
          months[key] = {
            month,
            year,
            amount: 0,
            timestamp:
              new Date(
                year,
                date.getMonth(),
                1
              ).getTime(),
          };
        }

        months[key].amount +=
          Number(
            expense.amount || 0
          );
      }
    );

    return Object.values(
      months
    )
      .sort(
        (a, b) =>
          a.timestamp -
          b.timestamp
      )
      .map(
        ({
          month,
          amount,
        }) => ({
          month,
          amount,
        })
      );
  }, [
    expenses,
    parseDate,
  ]);

  /* =========================================
     MONTH TRANSLATION
  ========================================= */

  const monthKeys = {
    Jan: "jan",
    Feb: "feb",
    Mar: "mar",
    Apr: "apr",
    May: "may",
    Jun: "jun",
    Jul: "jul",
    Aug: "aug",
    Sep: "sep",
    Oct: "oct",
    Nov: "nov",
    Dec: "dec",
  };

  /* =========================================
     RECENT TRANSACTIONS
  ========================================= */

  const recentTransactions =
    useMemo(() => {
      return [...expenses]
        .sort((a, b) => {
          const dateA =
            parseDate(
              a.date
            ) ||
            new Date(
              a.createdAt || 0
            );

          const dateB =
            parseDate(
              b.date
            ) ||
            new Date(
              b.createdAt || 0
            );

          return dateB - dateA;
        })
        .slice(0, 5);
    }, [
      expenses,
      parseDate,
    ]);

  /* =========================================
     COLORS
  ========================================= */

  const chartColors = [
    "#3155e7",
    "#e83e8c",
    "#ff9f1c",
    "#7c4dff",
    "#20a39e",
    "#777777",
    "#e5484d",
    "#159570",
  ];

  /* =========================================
     ICONS
  ========================================= */

  const getIcon = (category) => {
    const icons = {
      Food: "🍔",
      Shopping: "🛒",
      Travel: "⛽",
      Education: "📚",
      Entertainment: "🎬",
      Bills: "🧾",
      Health: "💊",
      Other: "💰",
    };

    return (
      icons[category] ||
      "💰"
    );
  };

  /* =========================================
     RETURN
  ========================================= */

  return (
    <div className="dashboard">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div>

          <h1>
            {getGreeting()},{" "}
            {user.name || "there"} 👋
          </h1>

          <p>
            {t(
              "dashboardSubtitle"
            )}
          </p>

        </div>

        <button
          type="button"
          className="add-expense-btn"
          onClick={() =>
            navigate(
              "/expenses/add"
            )
          }
        >
          + {t("addExpense")}
        </button>

      </div>


      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="summary-grid">

        {/* INCOME */}

        <div className="summary-card income-card">

          <div className="card-top">

            <span>
              {t("totalIncome")}
            </span>

            <div className="card-icon">
              <ArrowUp size={17} />
            </div>

          </div>

          <h2>
            ₹
            {totalIncome.toLocaleString()}
          </h2>

          <p
            className={
              incomeComparison.className
            }
          >
            {incomeComparison.text}
          </p>

        </div>


        {/* EXPENSES */}

        <div className="summary-card expense-card">

          <div className="card-top">

            <span>
              {t("totalExpenses")}
            </span>

            <div className="card-icon">
              <ArrowDown size={17} />
            </div>

          </div>

          <h2>
            ₹
            {expenseLoading
              ? "..."
              : totalExpenses.toLocaleString()}
          </h2>

          <p
            className={
              expenseError
                ? "negative"
                : expenseComparison.className
            }
          >
            {expenseError
              ? "Unable to load"
              : expenseComparison.text}
          </p>

        </div>


        {/* BALANCE */}

        <div className="summary-card balance-card">

          <div className="card-top">

            <span>
              {t("balance")}
            </span>

            <div className="card-icon">
              <Wallet size={17} />
            </div>

          </div>

          <h2>
            ₹
            {balance.toLocaleString()}
          </h2>

          <p
            className={
              balance >= 0
                ? "positive"
                : "negative"
            }
          >
            {balance >= 0
              ? t(
                  "availableBalance"
                )
              : t(
                  "expensesExceedIncome"
                )}
          </p>

        </div>


        {/* BUDGET */}

        <div className="summary-card budget-card">

          <div className="card-top">

            <span>
              {t("budgets")}
            </span>

            <div className="budget-circle">
              {budgetPercentage}%
            </div>

          </div>

          <h2>
            ₹
            {totalExpenses.toLocaleString()}{" "}
            / ₹
            {totalBudget.toLocaleString()}
          </h2>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${budgetPercentage}%`,
              }}
            />

          </div>

          <p>

            {budgetRemaining >= 0
              ? `₹${budgetRemaining.toLocaleString()} ${t(
                  "remaining"
                )}`
              : `₹${Math.abs(
                  budgetRemaining
                ).toLocaleString()} ${t(
                  "overBudget"
                )}`}

          </p>

        </div>

      </div>


      {/* =====================================
          CHARTS
      ====================================== */}

      <div className="charts-grid">

        {/* MONTHLY EXPENSES */}

        <div className="chart-card">

          <div className="section-title">

            <div>

              <h2>
                {t(
                  "spendingTrend"
                )}
              </h2>

              <p>
                {t(
                  "totalExpenses"
                )}
              </p>

            </div>

          </div>

          <div className="dashboard-line-chart">

            {expenseLoading ? (

              <div className="chart-empty">
                Loading expense data...
              </div>

            ) : monthlyData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickFormatter={(
                      month
                    ) =>
                      t(
                        monthKeys[
                          month
                        ] || month
                      )
                    }
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(
                        value
                      ).toLocaleString()}`
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3155e7"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            ) : (

              <div className="chart-empty">
                {t(
                  "noExpenseData"
                )}
              </div>

            )}

          </div>

        </div>


        {/* CATEGORY CHART */}

        <div className="chart-card">

          <div className="section-title">

            <div>

              <h2>
                {t(
                  "expensesByCategory"
                )}
              </h2>

              <p>
                {t("thisMonth")}
              </p>

            </div>

          </div>


          <div className="pie-container">

            <div className="pie-chart-wrapper">

              {expenseLoading ? (

                <div className="chart-empty">
                  Loading...
                </div>

              ) : categoryData.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                    >

                      {categoryData.map(
                        (
                          entry,
                          index
                        ) => (

                          <Cell
                            key={`cell-${index}`}
                            fill={
                              chartColors[
                                index %
                                  chartColors.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(
                          value
                        ).toLocaleString()}`
                      }
                    />

                  </PieChart>

                </ResponsiveContainer>

              ) : (

                <div className="chart-empty">
                  {t(
                    "noExpenseData"
                  )}
                </div>

              )}

            </div>


            <div className="category-list">

              {categoryData.length >
              0 ? (

                categoryData.map(
                  (
                    category
                  ) => (

                    <div
                      className="category-item"
                      key={
                        category.name
                      }
                    >

                      <span>
                        {getCategoryLabel(
                          category.name
                        )}
                      </span>

                      <strong>
                        ₹
                        {category.value.toLocaleString()}
                      </strong>

                    </div>

                  )
                )

              ) : (

                <div className="chart-empty">

                  {t(
                    "addExpensesTrend"
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          SMART INSIGHT
      ====================================== */}

      <div className="dashboard-insight">

        <div className="dashboard-insight-icon">
          💡
        </div>

        <div>

          <h2>
            {t(
              "smartInsight"
            )}
          </h2>

          <p>

            {categoryData.length > 0
              ? t(
                  "highestCategoryInsight",
                  {
                    category:
                      getCategoryLabel(
                        categoryData[0]
                          .name
                      ),
                    amount:
                      categoryData[0].value.toLocaleString(),
                  }
                )
              : t(
                  "emptyInsight"
                )}

          </p>

        </div>

      </div>


      {/* =====================================
          RECENT TRANSACTIONS
      ====================================== */}

      <div className="transactions-card">

        <div className="section-title">

          <div>

            <h2>
              {t(
                "transactions"
              )}
            </h2>

            <p>
              {t(
                "allExpenses"
              )}
            </p>

          </div>


          <button
            type="button"
            className="view-all"
            onClick={() =>
              navigate(
                "/expenses"
              )
            }
          >
            {t(
              "allExpenses"
            )} →
          </button>

        </div>


        <div className="transaction-list">

          {expenseLoading ? (

            <div className="chart-empty">
              Loading transactions...
            </div>

          ) : recentTransactions.length >
            0 ? (

            recentTransactions.map(
              (expense) => (

                <div
                  className="transaction-row"
                  key={
                    expense.id
                  }
                >

                  <div className="transaction-left">

                    <div className="transaction-icon">

                      {expense.icon ||
                        getIcon(
                          expense.category
                        )}

                    </div>

                    <div>

                      <h3>
                        {
                          expense.title
                        }
                      </h3>

                      <span>
                        {getCategoryLabel(
                          expense.category
                        )}
                      </span>

                    </div>

                  </div>


                  <span className="transaction-date">
                    {
                      expense.date
                    }
                  </span>


                  <strong className="transaction-amount">
                    - ₹
                    {Number(
                      expense.amount ||
                        0
                    ).toLocaleString()}
                  </strong>


                  <button
                    type="button"
                    className="more-btn"
                    onClick={() =>
                      navigate(
                        "/expenses"
                      )
                    }
                  >
                    ⋯
                  </button>

                </div>

              )
            )

          ) : (

            <div className="chart-empty">
              {t("noData")}
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;