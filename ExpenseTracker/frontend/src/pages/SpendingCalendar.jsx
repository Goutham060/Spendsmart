import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { API_BASE_URL } from "../services/api";

import "../assets/styles/spendingCalendar.css";

function SpendingCalendar() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  const [currentMonth, setCurrentMonth] =
    useState(new Date());

  /* =========================================
     LOGGED-IN USER
  ========================================= */

  const getUser = () => {
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
     LOAD EXPENSES
  ========================================= */

  const loadExpenses = async () => {
    const user = getUser();

    if (!user?.id) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/expenses?userId=${encodeURIComponent(
          user.id
        )}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load expenses"
        );
      }

      const data = await response.json();

      setExpenses(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Spending calendar error:",
        error
      );

      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();

    const refreshExpenses = () => {
      loadExpenses();
    };

    window.addEventListener(
      "expenseChanged",
      refreshExpenses
    );

    window.addEventListener(
      "focus",
      refreshExpenses
    );

    return () => {
      window.removeEventListener(
        "expenseChanged",
        refreshExpenses
      );

      window.removeEventListener(
        "focus",
        refreshExpenses
      );
    };
  }, []);

  /* =========================================
     DATE HELPERS
  ========================================= */

  const parseDate = (value) => {
    if (!value) return null;

    const stringValue =
      String(value).trim();

    /* YYYY-MM-DD */

    const isoMatch =
      stringValue.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
      );

    if (isoMatch) {
      return new Date(
        Number(isoMatch[1]),
        Number(isoMatch[2]) - 1,
        Number(isoMatch[3])
      );
    }

    /* DD/MM/YYYY */

    const numericMatch =
      stringValue.match(
        /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
      );

    if (numericMatch) {
      return new Date(
        Number(numericMatch[3]),
        Number(numericMatch[2]) - 1,
        Number(numericMatch[1])
      );
    }

    const parsed =
      new Date(stringValue);

    return Number.isNaN(
      parsed.getTime()
    )
      ? null
      : parsed;
  };

  const makeDateKey = (date) => {
    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  /* =========================================
     CURRENT MONTH
  ========================================= */

  const year =
    currentMonth.getFullYear();

  const month =
    currentMonth.getMonth();

  const monthLabel =
    currentMonth.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    );

  const firstDay = new Date(
    year,
    month,
    1
  );

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  /*
    Convert JS Sunday-first index
    into Monday-first.
  */

  const startOffset =
    (firstDay.getDay() + 6) % 7;

  /* =========================================
     EXPENSES FOR CURRENT MONTH
  ========================================= */

  const monthExpenses = useMemo(() => {
    return expenses.filter(
      (expense) => {
        const date = parseDate(
          expense.date
        );

        if (!date) return false;

        return (
          date.getFullYear() === year &&
          date.getMonth() === month
        );
      }
    );
  }, [expenses, year, month]);

  /* =========================================
     GROUP BY DATE
  ========================================= */

  const expensesByDate = useMemo(() => {
    const grouped = {};

    monthExpenses.forEach(
      (expense) => {
        const date = parseDate(
          expense.date
        );

        if (!date) return;

        const key =
          makeDateKey(date);

        if (!grouped[key]) {
          grouped[key] = [];
        }

        grouped[key].push(expense);
      }
    );

    return grouped;
  }, [monthExpenses]);

  /* =========================================
     DAILY TOTALS
  ========================================= */

  const dailyTotals = useMemo(() => {
    const totals = {};

    Object.entries(
      expensesByDate
    ).forEach(
      ([key, items]) => {
        totals[key] = items.reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );
      }
    );

    return totals;
  }, [expensesByDate]);

  /* =========================================
     MONTH TOTAL
  ========================================= */

  const monthTotal = useMemo(() => {
    return monthExpenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );
  }, [monthExpenses]);

  /* =========================================
     HIGHEST SPENDING DAY
  ========================================= */

  const highestDay = useMemo(() => {
    const entries =
      Object.entries(
        dailyTotals
      );

    if (!entries.length) {
      return null;
    }

    entries.sort(
      (a, b) => b[1] - a[1]
    );

    return {
      date: entries[0][0],
      amount: entries[0][1],
    };
  }, [dailyTotals]);

  /* =========================================
     NO-SPEND DAYS
  ========================================= */

  const noSpendDays = useMemo(() => {
    let count = 0;

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      const key =
        makeDateKey(
          new Date(
            year,
            month,
            day
          )
        );

      if (!dailyTotals[key]) {
        count++;
      }
    }

    return count;
  }, [
    year,
    month,
    daysInMonth,
    dailyTotals,
  ]);

  /* =========================================
     DAILY LEVEL
  ========================================= */

  const getLevel = (amount) => {
    if (!amount) return "level-0";
    if (amount <= 300) return "level-1";
    if (amount <= 700) return "level-2";
    if (amount <= 1200) return "level-3";
    return "level-4";
  };

  /* =========================================
     NAVIGATION
  ========================================= */

  const previousMonth = () => {
    setCurrentMonth(
      new Date(
        year,
        month - 1,
        1
      )
    );

    setSelectedDate("");
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(
        year,
        month + 1,
        1
      )
    );

    setSelectedDate("");
  };

  const goToday = () => {
    setCurrentMonth(
      new Date()
    );

    setSelectedDate("");
  };

  /* =========================================
     CALENDAR CELLS
  ========================================= */

  const calendarCells = [];

  for (
    let i = 0;
    i < startOffset;
    i++
  ) {
    calendarCells.push(
      <div
        key={`empty-${i}`}
        className="calendar-day empty"
      />
    );
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    const date =
      new Date(
        year,
        month,
        day
      );

    const key =
      makeDateKey(date);

    const total =
      dailyTotals[key] || 0;

    const hasExpenses =
      Boolean(
        expensesByDate[key]?.length
      );

    const todayKey =
      makeDateKey(
        new Date()
      );

    const isToday =
      key === todayKey;

    const isSelected =
      key === selectedDate;

    calendarCells.push(
      <button
        type="button"
        key={key}
        className={`calendar-day ${getLevel(
          total
        )} ${
          hasExpenses
            ? "has-expenses"
            : ""
        } ${
          isToday
            ? "today"
            : ""
        } ${
          isSelected
            ? "selected"
            : ""
        }`}
        onClick={() => {
          if (hasExpenses) {
            setSelectedDate(
              key
            );
          }
        }}
      >
        <span className="day-number">
          {day}
        </span>

        {total > 0 && (
          <span className="day-amount">
            ₹
            {total.toLocaleString(
              "en-IN"
            )}
          </span>
        )}

        {hasExpenses && (
          <span className="day-dot" />
        )}
      </button>
    );
  }

  /* =========================================
     SELECTED DAY
  ========================================= */

  const selectedExpenses =
    selectedDate
      ? expensesByDate[
          selectedDate
        ] || []
      : [];

  const selectedTotal =
    selectedExpenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  const selectedDateLabel =
    selectedDate
      ? new Date(
          `${selectedDate}T00:00:00`
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "";

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="spending-calendar-page">
        <div className="calendar-loading">
          <CalendarDays
            size={34}
          />

          <p>
            Loading your spending calendar...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="spending-calendar-page">

      {/* HEADER */}

      <div className="calendar-header">

        <div className="calendar-title-row">

          <div className="calendar-title-icon">
            <CalendarDays
              size={22}
            />
          </div>

          <div>
            <h1>
              Spending Calendar
            </h1>

            <p>
              See when you spend the most
            </p>
          </div>

        </div>

        <button
          type="button"
          className="calendar-today-btn"
          onClick={goToday}
        >
          Today
        </button>

      </div>


      {/* SUMMARY */}

      <div className="calendar-summary-grid">

        <div className="calendar-summary-card">

          <span>
            Month Spent
          </span>

          <strong>
            ₹
            {monthTotal.toLocaleString(
              "en-IN"
            )}
          </strong>

          <small>
            {monthExpenses.length}{" "}
            transactions
          </small>

        </div>


        <div className="calendar-summary-card">

          <span>
            Highest Spending Day
          </span>

          <strong>
            ₹
            {highestDay
              ? highestDay.amount.toLocaleString(
                  "en-IN"
                )
              : "0"}
          </strong>

          <small>
            {highestDay
              ? new Date(
                  `${highestDay.date}T00:00:00`
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                  }
                )
              : "No spending yet"}
          </small>

        </div>


        <div className="calendar-summary-card">

          <span>
            No-Spend Days
          </span>

          <strong>
            {noSpendDays}
          </strong>

          <small>
            this month
          </small>

        </div>

      </div>


      {/* CALENDAR */}

      <div className="calendar-main-card">

        <div className="calendar-month-header">

          <button
            type="button"
            className="calendar-nav-btn"
            onClick={
              previousMonth
            }
          >
            <ChevronLeft
              size={19}
            />
          </button>

          <h2>
            {monthLabel}
          </h2>

          <button
            type="button"
            className="calendar-nav-btn"
            onClick={
              nextMonth
            }
          >
            <ChevronRight
              size={19}
            />
          </button>

        </div>


        <div className="calendar-weekdays">
          {[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ].map((day) => (
            <div
              key={day}
              className="calendar-weekday"
            >
              {day}
            </div>
          ))}
        </div>


        <div className="calendar-grid">
          {calendarCells}
        </div>


        <div className="calendar-legend">
          <span>Less</span>

          <i className="legend-box level-0" />
          <i className="legend-box level-1" />
          <i className="legend-box level-2" />
          <i className="legend-box level-3" />
          <i className="legend-box level-4" />

          <span>More</span>
        </div>

      </div>


      {/* SELECTED DAY */}

      {selectedDate && (
        <div className="calendar-detail-card">

          <div className="calendar-detail-header">

            <div>
              <span>
                Selected Day
              </span>

              <h2>
                {selectedDateLabel}
              </h2>
            </div>

            <button
              type="button"
              className="calendar-close-btn"
              onClick={() =>
                setSelectedDate("")
              }
            >
              <X size={18} />
            </button>

          </div>


          <div className="calendar-detail-total">

            <span>
              Total Spent
            </span>

            <strong>
              ₹
              {selectedTotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>


          <div className="calendar-expense-list">

            {selectedExpenses.map(
              (expense) => (
                <div
                  key={expense.id}
                  className="calendar-expense-row"
                >

                  <div className="calendar-expense-left">

                    <div className="calendar-expense-icon">
                      {expense.icon ||
                        "💰"}
                    </div>

                    <div>
                      <strong>
                        {expense.title}
                      </strong>

                      <span>
                        {expense.category}
                      </span>
                    </div>

                  </div>

                  <strong>
                    ₹
                    {Number(
                      expense.amount || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              )
            )}

          </div>


          <div className="calendar-detail-footer">
            {selectedExpenses.length}{" "}
            {selectedExpenses.length === 1
              ? "transaction"
              : "transactions"}
          </div>

        </div>
      )}


      {/* NO DATA */}

      {expenses.length === 0 && (
        <div className="calendar-empty-state">

          <CalendarDays
            size={42}
          />

          <h2>
            No expenses yet
          </h2>

          <p>
            Add your first expense and
            your calendar will start
            tracking your spending.
          </p>

        </div>
      )}

    </div>
  );
}

export default SpendingCalendar;