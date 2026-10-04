import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import {
  getStoredCategories,
  getCategoryLabel,
} from "../utils/categoryUtils";

import "../assets/styles/addExpense.css";

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     GET LOGGED-IN USER
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
     LOAD EXPENSE FROM BACKEND
  ========================================= */

  useEffect(() => {
    const loadExpense = async () => {
      setLoading(true);
      setError("");

      const user = getCurrentUser();

      if (!user?.id) {
        setError(
          "User session not found. Please log in again."
        );
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/expenses/${id}?userId=${user.id}`
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          window.alert(
            data?.message ||
              t("expenseNotFound")
          );

          navigate("/expenses");
          return;
        }

        /* ===============================
           POPULATE FORM
        =============================== */

        setTitle(
          data.title || ""
        );

        setAmount(
          data.amount ?? ""
        );

        setCategory(
          data.category || ""
        );

        setPaymentMethod(
          data.paymentMethod || ""
        );

        setNotes(
          data.notes || ""
        );

        /*
          Backend LocalDate is returned as:
          2026-10-02

          So it can be used directly by
          <input type="date">.
        */

        setDate(
          data.date || ""
        );

      } catch (requestError) {
        console.error(
          "Load expense failed:",
          requestError
        );

        setError(
          "Unable to connect to the server. Make sure the Spring Boot backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExpense();
  }, [id, navigate, t]);

  /* =========================================
     CATEGORY ICON
  ========================================= */

  const getCategoryIcon = (
    categoryValue
  ) => {
    const icons = {
      Food: "🍴",
      Shopping: "🛍️",
      Travel: "🚗",
      Entertainment: "🎬",
      Education: "📚",
      Bills: "🧾",
      Health: "💊",
      Other: "💰",
    };

    return (
      icons[categoryValue] ||
      "💰"
    );
  };

  /* =========================================
     PAYMENT LABEL
  ========================================= */

  const getPaymentMethodLabel = (
    payment
  ) => {
    const paymentKeys = {
      UPI: "upi",
      "Debit Card": "debitCard",
      "Credit Card": "creditCard",
      Cash: "cash",
      "Net Banking": "netBanking",
      "Bank Transfer":
        "bankTransfer",
      Other: "other",
    };

    return t(
      paymentKeys[payment] ||
        "other"
    );
  };

  /* =========================================
     CATEGORY OPTIONS
  ========================================= */

  const categoryOptions = useMemo(() => {
    const options =
      getStoredCategories();

    /*
      If an expense has a custom category
      which was later removed from the
      category list, keep it visible while
      editing this existing expense.
    */

    if (
      category &&
      !options.some(
        (item) =>
          String(item).toLowerCase() ===
          String(category).toLowerCase()
      )
    ) {
      return [
        ...options,
        category,
      ];
    }

    return options;
  }, [category]);

  /* =========================================
     PAYMENT OPTIONS
  ========================================= */

  const paymentOptions = [
    "Bank Transfer",
    "UPI",
    "Cash",
    "Debit Card",
    "Credit Card",
    "Net Banking",
    "Other",
  ];

  /* =========================================
     SAVE UPDATED EXPENSE
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user =
      getCurrentUser();

    if (!user?.id) {
      setError(
        "User session not found. Please log in again."
      );
      navigate("/login");
      return;
    }

    /* =====================================
       VALIDATION
    ====================================== */

    const trimmedTitle =
      title.trim();

    const numericAmount =
      Number(amount);

    if (!trimmedTitle) {
      setError(
        "Please enter an expense title."
      );
      return;
    }

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      setError(
        "Please enter a valid amount."
      );
      return;
    }

    if (!category) {
      setError(
        "Please select a category."
      );
      return;
    }

    if (!date) {
      setError(
        "Please select a date."
      );
      return;
    }

    if (!paymentMethod) {
      setError(
        "Please select a payment method."
      );
      return;
    }

    /* =====================================
       START REQUEST
    ====================================== */

    setSaving(true);

    try {
      const updatedExpense = {
        title: trimmedTitle,
        amount: numericAmount,
        category,
        date,
        paymentMethod,
        notes: notes.trim(),
        icon: getCategoryIcon(
          category
        ),
      };

      const response =
        await fetch(
          `http://localhost:8080/api/expenses/${id}?userId=${user.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              updatedExpense
            ),
          }
        );

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      /* ===================================
         ERROR
      ==================================== */

      if (!response.ok) {
        setError(
          data?.message ||
            "Unable to update expense. Please try again."
        );

        return;
      }

      /* ===================================
         SUCCESS
      ==================================== */

      window.dispatchEvent(
        new Event("expenseChanged")
      );

      navigate("/expenses");

    } catch (requestError) {
      console.error(
        "Update expense failed:",
        requestError
      );

      setError(
        "Unable to connect to the server. Make sure the Spring Boot backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     LOADING STATE
  ========================================= */

  if (loading) {
    return (
      <div className="add-expense-page">

        <div className="add-expense-header">

          <div>

            <Link
              to="/expenses"
              className="back-button"
            >
              <ArrowLeft size={17} />

              {t(
                "backToExpenses"
              )}
            </Link>

            <h1>
              {t("editExpense")}
            </h1>

            <p>
              {t(
                "updateExpenseDetails"
              )}
            </p>

          </div>

        </div>

        <div className="form-card">
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </div>

      </div>
    );
  }

  /* =========================================
     MAIN UI
  ========================================= */

  return (
    <div className="add-expense-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="add-expense-header">

        <div>

          <Link
            to="/expenses"
            className="back-button"
          >
            <ArrowLeft size={17} />

            {t(
              "backToExpenses"
            )}
          </Link>

          <h1>
            {t("editExpense")}
          </h1>

          <p>
            {t(
              "updateExpenseDetails"
            )}
          </p>

        </div>

      </div>

      {/* =====================================
          FORM
      ====================================== */}

      <form
        className="add-expense-form"
        onSubmit={
          handleSubmit
        }
      >

        <div className="form-card">

          {/* =================================
              ERROR
          ================================= */}

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* =================================
              EXPENSE TITLE
          ================================= */}

          <div className="form-group">

            <label>
              {t(
                "expenseTitle"
              )}
            </label>

            <input
              type="text"
              placeholder={t(
                "expenseTitleExample"
              )}
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              required
              disabled={saving}
            />

          </div>

          {/* =================================
              AMOUNT + CATEGORY
          ================================= */}

          <div className="form-row">

            <div className="form-group">

              <label>
                {t("amount")}
              </label>

              <input
                type="number"
                placeholder={t(
                  "enterAmount"
                )}
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                required
                disabled={saving}
              />

            </div>

            <div className="form-group">

              <label>
                {t("category")}
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                required
                disabled={saving}
              >

                <option value="">
                  {t(
                    "selectCategory"
                  )}
                </option>

                {categoryOptions.map(
                  (
                    categoryValue
                  ) => (
                    <option
                      key={
                        categoryValue
                      }
                      value={
                        categoryValue
                      }
                    >
                      {getCategoryLabel(
                        categoryValue,
                        t
                      )}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* =================================
              DATE + PAYMENT METHOD
          ================================= */}

          <div className="form-row">

            <div className="form-group">

              <label>
                {t("date")}
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }
                required
                disabled={saving}
              />

            </div>

            <div className="form-group">

              <label>
                {t(
                  "paymentMethod"
                )}
              </label>

              <select
                value={
                  paymentMethod
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
                required
                disabled={saving}
              >

                <option value="">
                  {t(
                    "selectPaymentMethod"
                  )}
                </option>

                {paymentOptions.map(
                  (payment) => (
                    <option
                      key={payment}
                      value={payment}
                    >
                      {getPaymentMethodLabel(
                        payment
                      )}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* =================================
              NOTES
          ================================= */}

          <div className="form-group">

            <label>
              {t("notes")}
            </label>

            <textarea
              placeholder={t(
                "notesOptional"
              )}
              rows="4"
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              disabled={saving}
            />

          </div>

          {/* =================================
              ACTIONS
          ================================= */}

          <div className="form-actions">

            <Link
              to="/expenses"
              className="cancel-button"
            >
              {t("cancel")}
            </Link>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              <Save size={16} />

              {saving
                ? "Updating..."
                : t(
                    "updateExpense"
                  )}

            </button>

          </div>

        </div>

      </form>

    </div>
  );
}

export default EditExpense;