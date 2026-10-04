import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import {
  getStoredCategories,
  getCategoryLabel,
} from "../utils/categoryUtils";
import { API_BASE_URL } from "../services/api";

import "../assets/styles/addExpense.css";

function AddExpense() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================================
     CATEGORY OPTIONS
  ========================================= */

  const categoryOptions =
    getStoredCategories();

  /* =========================================
     CATEGORY ICON
  ========================================= */

  const getCategoryIcon = (categoryValue) => {
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
      icons[categoryValue] || "💰"
    );
  };

  /* =========================================
     PAYMENT METHOD LABEL
  ========================================= */

  const getPaymentMethodLabel = (value) => {
    const paymentKeys = {
      "Bank Transfer": "bankTransfer",
      UPI: "upi",
      Cash: "cash",
      "Debit Card": "debitCard",
      "Credit Card": "creditCard",
      "Net Banking": "netBanking",
      Other: "other",
    };

    return t(
      paymentKeys[value] || "other"
    );
  };

  /* =========================================
     SAVE EXPENSE
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

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
       GET LOGGED-IN USER
    ====================================== */

    let user = null;

    try {
      user =
        JSON.parse(
          localStorage.getItem(
            "spendmate_user"
          )
        ) || null;
    } catch {
      user = null;
    }

    if (!user?.id) {
      setError(
        "User session not found. Please log in again."
      );
      navigate("/login");
      return;
    }

    /* =====================================
       START REQUEST
    ====================================== */

    setLoading(true);

    try {
      const expenseData = {
        title: trimmedTitle,
        amount: numericAmount,
        category,
        date,
        paymentMethod,
        notes: notes.trim(),
        icon: getCategoryIcon(category),
      };

      const response =
        await fetch(
          `${API_BASE_URL}/api/expenses?userId=${user.id}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              expenseData
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
            "Unable to save expense. Please try again."
        );
        return;
      }

      /* ===================================
         SUCCESS
      ==================================== */

      /*
        Notify Navbar that a new expense
        has been created.
      */

      window.dispatchEvent(
        new Event("expenseChanged")
      );

      navigate("/expenses");

    } catch (requestError) {
      console.error(
        "Create expense failed:",
        requestError
      );

      setError(
        "Unable to connect to the server. Make sure the Spring Boot backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

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
            {t("addExpense")}
          </h1>

          <p>
            {t(
              "recordNewExpense"
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
              disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
              DATE + PAYMENT
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
                disabled={loading}
              />

            </div>

            <div className="form-group">

              <label>
                {t(
                  "paymentMethod"
                )}
              </label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
                required
                disabled={loading}
              >

                <option value="">
                  {t(
                    "selectPaymentMethod"
                  )}
                </option>

                <option value="Bank Transfer">
                  {getPaymentMethodLabel(
                    "Bank Transfer"
                  )}
                </option>

                <option value="UPI">
                  {getPaymentMethodLabel(
                    "UPI"
                  )}
                </option>

                <option value="Cash">
                  {getPaymentMethodLabel(
                    "Cash"
                  )}
                </option>

                <option value="Debit Card">
                  {getPaymentMethodLabel(
                    "Debit Card"
                  )}
                </option>

                <option value="Credit Card">
                  {getPaymentMethodLabel(
                    "Credit Card"
                  )}
                </option>

                <option value="Net Banking">
                  {getPaymentMethodLabel(
                    "Net Banking"
                  )}
                </option>

                <option value="Other">
                  {getPaymentMethodLabel(
                    "Other"
                  )}
                </option>

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
              disabled={loading}
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
              disabled={loading}
            >
              <Save size={16} />

              {loading
                ? "Saving..."
                : t(
                    "saveExpense"
                  )}

            </button>

          </div>

        </div>

      </form>

    </div>
  );
}

export default AddExpense;