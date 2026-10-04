import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";

import { useLanguage } from "../context/LanguageContext";
import { getCategoryLabel } from "../utils/categoryUtils";
import { API_BASE_URL } from "../services/api";

import "../assets/styles/reports.css";

function Reports() {
  const { t } = useLanguage();

  /* =========================================
     CURRENT USER
  ========================================= */

  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("spendmate_user")
      );
    } catch {
      return null;
    }
  }, []);

  /* =========================================
     EXPENSES FROM BACKEND
  ========================================= */

  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] =
    useState(true);

  const loadExpenses = async () => {
    if (!user?.id) {
      setExpenses([]);
      setLoadingExpenses(false);
      return;
    }

    try {
      setLoadingExpenses(true);

      const response = await fetch(
        `${API_BASE_URL}/api/expenses?userId=${user.id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch expenses"
        );
      }

      const data = await response.json();

      setExpenses(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Error loading report expenses:",
        error
      );

      setExpenses([]);
    } finally {
      setLoadingExpenses(false);
    }
  };

  /* =========================================
     INCOME
     ========================================= */

  const [income, setIncome] = useState([]);

  const loadIncome = () => {
    try {
      const savedIncome =
        JSON.parse(
          localStorage.getItem(
            "spendmate_income"
          )
        ) || [];

      setIncome(
        Array.isArray(savedIncome)
          ? savedIncome
          : []
      );
    } catch {
      setIncome([]);
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    loadExpenses();
    loadIncome();

    const handleExpenseChanged = () => {
      loadExpenses();
    };

    const handleIncomeChanged = () => {
      loadIncome();
    };

    const handleFocus = () => {
      loadExpenses();
      loadIncome();
    };

    const handlePageShow = () => {
      loadExpenses();
      loadIncome();
    };

    window.addEventListener(
      "expenseChanged",
      handleExpenseChanged
    );

    window.addEventListener(
      "incomeChanged",
      handleIncomeChanged
    );

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "pageshow",
      handlePageShow
    );

    return () => {
      window.removeEventListener(
        "expenseChanged",
        handleExpenseChanged
      );

      window.removeEventListener(
        "incomeChanged",
        handleIncomeChanged
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "pageshow",
        handlePageShow
      );
    };
  }, [user?.id]);

  /* =========================================
     CATEGORY LABEL
  ========================================= */

  const getCategoryDisplayLabel = (value) => {
    return getCategoryLabel(value, t);
  };

  /* =========================================
     MONTH LABEL
  ========================================= */

  const getMonthLabel = (month) => {
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

    return t(
      monthKeys[month] || month
    );
  };

  /* =========================================
     DATE PARSER
  ========================================= */

  const parseDate = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
      return value;
    }

    const text = String(value).trim();

    /*
      Backend format:
      2026-09-18

      Also supports:
      18/09/2026
      18-09-2026
      18 Sep 2026
      18 Sept 2026
    */

    const isoMatch = text.match(
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

    const numericMatch = text.match(
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
    );

    if (numericMatch) {
      const day = Number(
        numericMatch[1]
      );

      const month =
        Number(numericMatch[2]) - 1;

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
  };

  /* =========================================
     EXPENSE CATEGORY DATA
  ========================================= */

  const expenseData = useMemo(() => {
    const categoryTotals = {};

    expenses.forEach((expense) => {
      const category =
        expense.category ||
        "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(expense.amount || 0);
    });

    return Object.entries(
      categoryTotals
    ).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses]);

  /* =========================================
     TOTALS
  ========================================= */

  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  const totalIncome =
    income.reduce(
      (sum, item) =>
        sum +
        Number(
          item.amount || 0
        ),
      0
    );

  const balance =
    totalIncome - totalExpenses;

  /* =========================================
     HIGHEST CATEGORY
  ========================================= */

  const highestCategory =
    expenseData.length > 0
      ? expenseData.reduce(
          (highest, item) =>
            item.value >
            highest.value
              ? item
              : highest
        )
      : null;

  /* =========================================
     MONTHLY DATA
  ========================================= */

  const monthlyData = useMemo(() => {
    const months = {};

    /* =====================================
       EXPENSES
    ===================================== */

    expenses.forEach((expense) => {
      const date = parseDate(
        expense.date
      );

      if (!date) return;

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
          key,
          month,
          year,
          expenses: 0,
          income: 0,
          timestamp:
            new Date(
              year,
              date.getMonth(),
              1
            ).getTime(),
        };
      }

      months[key].expenses +=
        Number(
          expense.amount || 0
        );
    });

    /* =====================================
       INCOME
    ===================================== */

    income.forEach((item) => {
      const date = parseDate(
        item.date
      );

      if (!date) return;

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
          key,
          month,
          year,
          expenses: 0,
          income: 0,
          timestamp:
            new Date(
              year,
              date.getMonth(),
              1
            ).getTime(),
        };
      }

      months[key].income +=
        Number(
          item.amount || 0
        );
    });

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
          key,
          month,
          expenses,
          income,
        }) => ({
          key,
          month,
          expenses,
          income,
        })
      );
  }, [expenses, income]);

  /* =========================================
     CHART COLORS
  ========================================= */

  const colors = [
    "#3155e7",
    "#159570",
    "#f59e0b",
    "#e5484d",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#64748b",
  ];

  return (
    <div className="reports-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="reports-header">
        <div>
          <h1>
            {t("reportsTitle")}
          </h1>

          <p>
            {t("understandMoney")}
          </p>
        </div>
      </div>

      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="reports-summary">

        <div className="report-summary-card">
          <span>
            {t("totalIncome")}
          </span>

          <h2 className="income-value">
            ₹
            {totalIncome.toLocaleString()}
          </h2>

          <small>
            {t("recordedIncome")}
          </small>
        </div>

        <div className="report-summary-card">
          <span>
            {t("totalExpenses")}
          </span>

          <h2 className="expense-value">
            ₹
            {loadingExpenses
              ? "..."
              : totalExpenses.toLocaleString()}
          </h2>

          <small>
            {t("recordedExpenses")}
          </small>
        </div>

        <div className="report-summary-card">
          <span>
            {t("balance")}
          </span>

          <h2
            className={
              balance >= 0
                ? "income-value"
                : "expense-value"
            }
          >
            ₹
            {loadingExpenses
              ? "..."
              : balance.toLocaleString()}
          </h2>

          <small>
            {t(
              "incomeMinusExpenses"
            )}
          </small>
        </div>

        <div className="report-summary-card">
          <span>
            {t("topCategory")}
          </span>

          <h2>
            {highestCategory
              ? getCategoryDisplayLabel(
                  highestCategory.name
                )
              : "-"}
          </h2>

          <small>
            {highestCategory
              ? t(
                  "spentAmount",
                  {
                    amount:
                      `₹${highestCategory.value.toLocaleString()}`,
                  }
                )
              : t(
                  "noExpenseData"
                )}
          </small>
        </div>

      </div>

      {/* =====================================
          CHART GRID
      ====================================== */}

      <div className="reports-grid">

        {/* ===================================
            EXPENSES BY CATEGORY
        ==================================== */}

        <div className="report-card">

          <div className="report-card-header">
            <div>
              <h2>
                {t(
                  "expensesByCategory"
                )}
              </h2>

              <p>
                {t(
                  "categorySpending"
                )}
              </p>
            </div>
          </div>

          <div className="chart-container">

            {loadingExpenses ? (
              <div className="chart-empty">
                Loading...
              </div>
            ) : expenseData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={expenseData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {expenseData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            colors[
                              index %
                                colors.length
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
                    labelFormatter={(
                      label
                    ) =>
                      getCategoryDisplayLabel(
                        label
                      )
                    }
                  />

                  <Legend
                    formatter={(
                      value
                    ) =>
                      getCategoryDisplayLabel(
                        value
                      )
                    }
                  />

                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                {t("noExpenseData")}
              </div>
            )}

          </div>
        </div>

        {/* ===================================
            INCOME VS EXPENSES
        ==================================== */}

        <div className="report-card">

          <div className="report-card-header">
            <div>
              <h2>
                {t(
                  "incomeVsExpenses"
                )}
              </h2>

              <p>
                {t(
                  "compareIncomeExpenses"
                )}
              </p>
            </div>
          </div>

          <div className="chart-container">

            {monthlyData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={monthlyData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickFormatter={
                      getMonthLabel
                    }
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(
                        value
                      ).toLocaleString()}`
                    }
                    labelFormatter={
                      getMonthLabel
                    }
                  />

                  <Legend />

                  <Bar
                    dataKey="income"
                    name={t("income")}
                    fill="#159570"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                  <Bar
                    dataKey="expenses"
                    name={t("expenses")}
                    fill="#e5484d"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                {t(
                  "addIncomeExpenses"
                )}
              </div>
            )}

          </div>
        </div>

        {/* ===================================
            SPENDING TREND
        ==================================== */}

        <div className="report-card report-card-wide">

          <div className="report-card-header">
            <div>
              <h2>
                {t("spendingTrend")}
              </h2>

              <p>
                {t(
                  "trackExpensesOverTime"
                )}
              </p>
            </div>
          </div>

          <div className="chart-container">

            {monthlyData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={monthlyData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickFormatter={
                      getMonthLabel
                    }
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(
                        value
                      ).toLocaleString()}`
                    }
                    labelFormatter={
                      getMonthLabel
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name={t("expenses")}
                    stroke="#3155e7"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                </LineChart>
              </ResponsiveContainer>
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

      {/* =====================================
          SMART INSIGHT
      ====================================== */}

      <div className="smart-insight-card">

        <div className="smart-insight-icon">
          💡
        </div>

        <div>

          <h2>
            {t("smartInsight")}
          </h2>

          <p>
            {highestCategory
              ? t(
                  "highestCategoryInsight",
                  {
                    category:
                      getCategoryDisplayLabel(
                        highestCategory.name
                      ),
                    amount:
                      `₹${highestCategory.value.toLocaleString()}`,
                  }
                )
              : t("emptyInsight")}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Reports;