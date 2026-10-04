import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import {
  getStoredCategories,
  getCategoryLabel,
} from "../utils/categoryUtils";
import { API_BASE_URL } from "../services/api";

import "../assets/styles/expenses.css";

function Expenses() {
  const { t } = useLanguage();

  /* =========================================
     STATE
  ========================================= */

  const [expenses, setExpenses] = useState([]);

  const [search, setSearch] = useState(() => {
    return (
      localStorage.getItem(
        "spendmate_expenses_search"
      ) || ""
    );
  });

  const [category, setCategory] =
    useState("All Categories");

  // SHOW ALL EXPENSES BY DEFAULT
  const [period, setPeriod] =
    useState("all");

  const [sortOrder, setSortOrder] =
    useState("newest");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================================
     GET CURRENT USER
  ========================================= */

  const getCurrentUser = () => {
    try {
      return (
        JSON.parse(
          localStorage.getItem(
            "spendmate_user"
          )
        ) || null
      );
    } catch {
      return null;
    }
  };

  /* =========================================
     LOAD EXPENSES FROM BACKEND
  ========================================= */

  const loadExpenses = useCallback(
    async () => {
      const user =
        getCurrentUser();

      if (!user?.id) {
        setExpenses([]);
        setError(
          "User session not found. Please log in again."
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/expenses?userId=${user.id}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        let data = [];

        try {
          data =
            await response.json();
        } catch {
          data = [];
        }

        if (!response.ok) {
          setError(
            data?.message ||
              "Unable to load expenses."
          );

          setExpenses([]);
          return;
        }

        setExpenses(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (requestError) {
        console.error(
          "Load expenses failed:",
          requestError
        );

        setError(
          "Unable to connect to the server. Make sure the Spring Boot backend is running."
        );

        setExpenses([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  /* =========================================
     REFRESH WHEN EXPENSE CHANGES
  ========================================= */

  useEffect(() => {
    const handleExpenseChange = () => {
      loadExpenses();
    };

    window.addEventListener(
      "expenseChanged",
      handleExpenseChange
    );

    return () => {
      window.removeEventListener(
        "expenseChanged",
        handleExpenseChange
      );
    };
  }, [loadExpenses]);

  /* =========================================
     REFRESH WHEN PAGE BECOMES VISIBLE AGAIN
  ========================================= */

  useEffect(() => {
    const handleFocus = () => {
      loadExpenses();
    };

    const handlePageShow = () => {
      loadExpenses();
    };

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
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "pageshow",
        handlePageShow
      );
    };
  }, [loadExpenses]);

  /* =========================================
     REFRESH SEARCH FROM NAVBAR
  ========================================= */

  useEffect(() => {
    const handleSearchChange = () => {
      const savedSearch =
        localStorage.getItem(
          "spendmate_expenses_search"
        ) || "";

      setSearch(savedSearch);
    };

    window.addEventListener(
      "expenseSearchChanged",
      handleSearchChange
    );

    return () => {
      window.removeEventListener(
        "expenseSearchChanged",
        handleSearchChange
      );
    };
  }, []);

  /* =========================================
     DATE PARSER
  ========================================= */

  const parseExpenseDate = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
      return value;
    }

    const stringValue =
      String(value).trim();

    /* ISO DATE
       2026-10-02
    */

    const isoMatch =
      stringValue.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
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

    /* DD/MM/YYYY */

    const numericMatch =
      stringValue.match(
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

    /* 18 Sep 2026 */

    const parsed =
      new Date(stringValue);

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
     CATEGORY LABEL
  ========================================= */

  const getCategoryDisplayLabel = (
    value
  ) => {
    return getCategoryLabel(
      value,
      t
    );
  };

  /* =========================================
     PAYMENT LABEL
  ========================================= */

  const getPaymentMethodLabel = (
    value
  ) => {
    const paymentKeys = {
      "Bank Transfer":
        "bankTransfer",
      UPI: "upi",
      Cash: "cash",
      "Debit Card":
        "debitCard",
      "Credit Card":
        "creditCard",
      "Net Banking":
        "netBanking",
      Other: "other",
    };

    return t(
      paymentKeys[value] ||
        "other"
    );
  };

  /* =========================================
     PERIOD FILTER
  ========================================= */

  const matchesPeriod = (
    expense
  ) => {
    /* ALL TIME */

    if (period === "all") {
      return true;
    }

    const expenseDate =
      parseExpenseDate(
        expense.date
      );

    if (!expenseDate) {
      return false;
    }

    const now = new Date();

    const currentYear =
      now.getFullYear();

    const currentMonth =
      now.getMonth();

    const expenseYear =
      expenseDate.getFullYear();

    const expenseMonth =
      expenseDate.getMonth();

    /* THIS MONTH */

    if (period === "this") {
      return (
        expenseYear ===
          currentYear &&
        expenseMonth ===
          currentMonth
      );
    }

    /* LAST MONTH */

    if (period === "last") {
      const lastMonth =
        new Date(
          currentYear,
          currentMonth - 1,
          1
        );

      return (
        expenseYear ===
          lastMonth.getFullYear() &&
        expenseMonth ===
          lastMonth.getMonth()
      );
    }

    /* LAST 3 MONTHS */

    if (
      period === "3months"
    ) {
      const expenseMonthIndex =
        expenseYear * 12 +
        expenseMonth;

      const currentMonthIndex =
        currentYear * 12 +
        currentMonth;

      const startMonthIndex =
        currentMonthIndex - 2;

      return (
        expenseMonthIndex >=
          startMonthIndex &&
        expenseMonthIndex <=
          currentMonthIndex
      );
    }

    /* THIS YEAR */

    if (period === "year") {
      return (
        expenseYear ===
        currentYear
      );
    }

    return true;
  };

  /* =========================================
     PERIOD FILTERED EXPENSES
  ========================================= */

  const periodFilteredExpenses =
    useMemo(() => {
      return expenses.filter(
        matchesPeriod
      );
    }, [
      expenses,
      period,
    ]);

  /* =========================================
     SEARCH + CATEGORY FILTER
  ========================================= */

  const filteredExpenses =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      const filtered =
        periodFilteredExpenses.filter(
          (expense) => {
            const title =
              String(
                expense.title || ""
              ).toLowerCase();

            const expenseCategory =
              String(
                expense.category ||
                  ""
              ).toLowerCase();

            const matchesSearch =
              !searchText ||
              title.includes(
                searchText
              ) ||
              expenseCategory.includes(
                searchText
              );

            const matchesCategory =
              category ===
                "All Categories" ||
              expense.category ===
                category;

            return (
              matchesSearch &&
              matchesCategory
            );
          }
        );

      return [...filtered].sort(
        (a, b) => {
          const dateA =
            parseExpenseDate(
              a.date
            );

          const dateB =
            parseExpenseDate(
              b.date
            );

          const timeA =
            dateA
              ? dateA.getTime()
              : 0;

          const timeB =
            dateB
              ? dateB.getTime()
              : 0;

          /* If dates are identical,
             use ID so newer DB rows
             appear first. */

          if (timeA === timeB) {
            return (
              sortOrder === "newest"
                ? Number(b.id || 0) -
                  Number(a.id || 0)
                : Number(a.id || 0) -
                  Number(b.id || 0)
            );
          }

          return sortOrder ===
            "newest"
            ? timeB - timeA
            : timeA - timeB;
        }
      );
    }, [
      periodFilteredExpenses,
      search,
      category,
      sortOrder,
    ]);

  /* =========================================
     SUMMARY
  ========================================= */

  const totalExpenses =
    periodFilteredExpenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );

  const averageSpending =
    periodFilteredExpenses.length
      ? Math.round(
          totalExpenses /
            periodFilteredExpenses.length
        )
      : 0;

  const highestExpense =
    periodFilteredExpenses.length
      ? Math.max(
          ...periodFilteredExpenses.map(
            (expense) =>
              Number(
                expense.amount || 0
              )
          )
        )
      : 0;

  const highestExpenseItem =
    periodFilteredExpenses.length
      ? periodFilteredExpenses.reduce(
          (highest, expense) =>
            Number(
              expense.amount || 0
            ) >
            Number(
              highest.amount || 0
            )
              ? expense
              : highest
        )
      : null;

  /* =========================================
     DELETE EXPENSE
  ========================================= */

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        t(
          "expenseDeleteConfirm"
        )
      );

    if (!confirmed) return;

    const user =
      getCurrentUser();

    if (!user?.id) {
      setError(
        "User session not found. Please log in again."
      );

      navigateToLogin();
      return;
    }

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/expenses/${id}?userId=${user.id}`,
          {
            method: "DELETE",
            cache: "no-store",
          }
        );

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        window.alert(
          data?.message ||
            "Unable to delete expense."
        );

        return;
      }

      setExpenses(
        (current) =>
          current.filter(
            (expense) =>
              String(expense.id) !==
              String(id)
          )
      );

      window.dispatchEvent(
        new Event("expenseChanged")
      );
    } catch (requestError) {
      console.error(
        "Delete expense failed:",
        requestError
      );

      window.alert(
        "Unable to connect to the server."
      );
    }
  };

  /* =========================================
     LOGIN REDIRECT
  ========================================= */

  const navigateToLogin = () => {
    window.location.href =
      "/login";
  };

  /* =========================================
     SORT
  ========================================= */

  const handleSortToggle = () => {
    setSortOrder(
      (current) =>
        current === "newest"
          ? "oldest"
          : "newest"
    );
  };

  /* =========================================
     CATEGORY OPTIONS
  ========================================= */

  const categoryOptions = [
    {
      value: "All Categories",
      label:
        t("allCategories"),
    },

    ...getStoredCategories().map(
      (categoryValue) => ({
        value: categoryValue,
        label:
          getCategoryDisplayLabel(
            categoryValue
          ),
      })
    ),
  ];

  /* =========================================
     PERIOD LABEL
  ========================================= */

  const currentPeriodLabel =
    period === "all"
      ? "All Time"
      : t(
          period === "this"
            ? "thisMonth"
            : period === "last"
            ? "lastMonth"
            : period === "3months"
            ? "last3Months"
            : "thisYear"
        );

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="expenses-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="expenses-header">

        <div>

          <h1>
            {t("expenses")}
          </h1>

          <p>
            {t(
              "trackManageSpending"
            )}
          </p>

        </div>

        <Link
          to="/expenses/add"
          className="add-expense-btn"
        >
          <Plus size={17} />

          {t("addExpense")}
        </Link>

      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="expense-summary">

        <div className="expense-summary-card">

          <span>
            {t(
              "totalExpenses"
            )}
          </span>

          <h2>
            ₹
            {totalExpenses.toLocaleString()}
          </h2>

          <small>
            {currentPeriodLabel}
          </small>

        </div>

        <div className="expense-summary-card">

          <span>
            {t(
              "transactions"
            )}
          </span>

          <h2>
            {
              periodFilteredExpenses.length
            }
          </h2>

          <small>
            {currentPeriodLabel}
          </small>

        </div>

        <div className="expense-summary-card">

          <span>
            {t(
              "averageSpending"
            )}
          </span>

          <h2>
            ₹
            {averageSpending.toLocaleString()}
          </h2>

          <small>
            {t(
              "perTransaction"
            )}
          </small>

        </div>

        <div className="expense-summary-card">

          <span>
            {t(
              "highestExpense"
            )}
          </span>

          <h2>
            ₹
            {highestExpense.toLocaleString()}
          </h2>

          <small>
            {highestExpenseItem
              ? getCategoryDisplayLabel(
                  highestExpenseItem.category
                )
              : "-"}
          </small>

        </div>

      </div>

      {/* =====================================
          FILTER BAR
      ====================================== */}

      <div className="expense-toolbar">

        <div className="expense-search">

          <Search size={17} />

          <input
            type="text"
            placeholder={t(
              "searchExpenses"
            )}
            value={search}
            onChange={(e) => {
              const value =
                e.target.value;

              setSearch(value);

              localStorage.setItem(
                "spendmate_expenses_search",
                value
              );
            }}
          />

        </div>

        <div className="expense-filters">

          {/* CATEGORY */}

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
          >
            {categoryOptions.map(
              (option) => (
                <option
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {option.label}
                </option>
              )
            )}
          </select>

          {/* PERIOD */}

          <select
            value={period}
            onChange={(e) =>
              setPeriod(
                e.target.value
              )
            }
          >
            <option value="all">
              All Time
            </option>

            <option value="this">
              {t("thisMonth")}
            </option>

            <option value="last">
              {t("lastMonth")}
            </option>

            <option value="3months">
              {t(
                "last3Months"
              )}
            </option>

            <option value="year">
              {t("thisYear")}
            </option>
          </select>

          <button
            type="button"
            className="filter-button"
          >
            <SlidersHorizontal
              size={16}
            />

            {t("filters")}
          </button>

        </div>

      </div>

      {/* =====================================
          TABLE CARD
      ====================================== */}

      <div className="expenses-table-card">

        <div className="expenses-table-header">

          <div>

            <h2>
              {t(
                "allExpenses"
              )}
            </h2>

            <p>
              {loading
                ? "Loading..."
                : filteredExpenses.length}{" "}
              {t(
                "transactionsFound"
              )}
            </p>

          </div>

          <button
            type="button"
            className="sort-button"
            onClick={
              handleSortToggle
            }
            disabled={loading}
          >
            {sortOrder === "newest"
              ? t("sortNewest")
              : t("sortOldest")}
          </button>

        </div>

        <div className="expense-table">

          {/* =================================
              TABLE HEADING
          ================================== */}

          <div className="expense-table-row expense-table-heading">

            <span>
              {t("expense")}
            </span>

            <span>
              {t("category")}
            </span>

            <span>
              {t("date")}
            </span>

            <span>
              {t(
                "paymentMethod"
              )}
            </span>

            <span>
              {t("amount")}
            </span>

            <span></span>

          </div>

          {/* =================================
              LOADING
          ================================== */}

          {loading && (
            <div className="no-expenses">
              <p>
                Loading expenses...
              </p>
            </div>
          )}

          {/* =================================
              ROWS
          ================================== */}

          {!loading &&
            filteredExpenses.map(
              (expense) => (
                <div
                  className="expense-table-row"
                  key={expense.id}
                >

                  <div className="expense-name">

                    <div className="expense-icon">
                      {expense.icon ||
                        "💰"}
                    </div>

                    <strong>
                      {expense.title}
                    </strong>

                  </div>

                  <span className="expense-category">
                    {getCategoryDisplayLabel(
                      expense.category
                    )}
                  </span>

                  <span className="expense-date">
                    {expense.date}
                  </span>

                  <span className="expense-payment">
                    {getPaymentMethodLabel(
                      expense.paymentMethod ||
                        expense.payment ||
                        "Other"
                    )}
                  </span>

                  <strong className="expense-amount">
                    - ₹
                    {Number(
                      expense.amount ||
                        0
                    ).toLocaleString()}
                  </strong>

                  <div className="expense-action-wrapper">

                    <details className="expense-details">

                      <summary className="expense-more">
                        <MoreHorizontal
                          size={20}
                        />
                      </summary>

                      <div className="expense-action-menu">

                        <Link
                          to={`/expenses/edit/${expense.id}`}
                          className="expense-action-item edit"
                        >
                          <Pencil
                            size={15}
                          />

                          {t(
                            "editExpense"
                          )}
                        </Link>

                        <button
                          type="button"
                          className="expense-action-item delete"
                          onClick={() =>
                            handleDelete(
                              expense.id
                            )
                          }
                        >
                          <Trash2
                            size={15}
                          />

                          {t(
                            "deleteExpense"
                          )}
                        </button>

                      </div>

                    </details>

                  </div>

                </div>
              )
            )}

          {/* =================================
              EMPTY
          ================================== */}

          {!loading &&
            filteredExpenses.length ===
              0 && (
              <div className="no-expenses">

                <p>
                  {t(
                    "noExpensesFound"
                  )}
                </p>

              </div>
            )}

        </div>

      </div>

    </div>
  );
}

export default Expenses;