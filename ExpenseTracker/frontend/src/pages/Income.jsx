import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Wallet,
  Briefcase,
  Gift,
  Banknote,
  X,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import "../assets/styles/income.css";

function Income() {
  const { t } = useLanguage();

  const [savedIncome, setSavedIncome] = useState([]);
  const [search, setSearch] = useState("");
  const [source, setSource] =
    useState("All Sources");

  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] =
    useState(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [incomeSource, setIncomeSource] =
    useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("");
  const [notes, setNotes] = useState("");

  /* =========================================
     LOAD SAVED INCOME
  ========================================= */

  useEffect(() => {
    try {
      const stored =
        JSON.parse(
          localStorage.getItem(
            "spendmate_income"
          )
        ) || [];

      setSavedIncome(stored);
    } catch {
      setSavedIncome([]);
    }
  }, []);

  /*
    IMPORTANT:
    There are NO demo/default income records.
  */

  const allIncome = savedIncome;

  /* =========================================
     SOURCE LABEL
  ========================================= */

  const getSourceLabel = (value) => {
    const sourceKeys = {
      Salary: "salary",
      Freelance: "freelance",
      Gift: "gift",
      Business: "business",
      Other: "other",
    };

    return t(
      sourceKeys[value] || "other"
    );
  };

  /* =========================================
     PAYMENT LABEL
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
     SEARCH + SOURCE FILTER
  ========================================= */

  const filteredIncome =
    allIncome.filter((income) => {
      const searchText =
        search.trim().toLowerCase();

      const titleText =
        String(
          income.title || ""
        ).toLowerCase();

      const sourceText =
        String(
          income.source || ""
        ).toLowerCase();

      const matchesSearch =
        !searchText ||
        titleText.includes(
          searchText
        ) ||
        sourceText.includes(
          searchText
        );

      const matchesSource =
        source === "All Sources" ||
        income.source === source;

      return (
        matchesSearch &&
        matchesSource
      );
    });

  /* =========================================
     SUMMARY
  ========================================= */

  const totalIncome = useMemo(() => {
    return allIncome.reduce(
      (total, income) =>
        total +
        Number(
          income.amount || 0
        ),
      0
    );
  }, [allIncome]);

  const averageIncome =
    allIncome.length
      ? Math.round(
          totalIncome /
            allIncome.length
        )
      : 0;

  const highestIncome =
    allIncome.length
      ? Math.max(
          ...allIncome.map(
            (income) =>
              Number(
                income.amount || 0
              )
          )
        )
      : 0;

  /* =========================================
     RESET FORM
  ========================================= */

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setIncomeSource("");
    setDate("");
    setPaymentMethod("");
    setNotes("");
    setEditingIncome(null);
    setShowForm(false);
  };

  /* =========================================
     ADD FORM
  ========================================= */

  const openAddForm = () => {
    setEditingIncome(null);
    setTitle("");
    setAmount("");
    setIncomeSource("");
    setDate("");
    setPaymentMethod("");
    setNotes("");
    setShowForm(true);
  };

  /* =========================================
     EDIT FORM
  ========================================= */

  const openEditForm = (income) => {
    setEditingIncome(income);

    setTitle(
      income.title || ""
    );

    setAmount(
      income.amount || ""
    );

    setIncomeSource(
      income.source || ""
    );

    setPaymentMethod(
      income.paymentMethod ||
        income.payment ||
        ""
    );

    setNotes(
      income.notes || ""
    );

    /*
      Convert stored date to YYYY-MM-DD.
    */

    const parsed =
      new Date(income.date);

    if (
      !Number.isNaN(
        parsed.getTime()
      )
    ) {
      setDate(
        `${parsed.getFullYear()}-${String(
          parsed.getMonth() + 1
        ).padStart(
          2,
          "0"
        )}-${String(
          parsed.getDate()
        ).padStart(
          2,
          "0"
        )}`
      );
    } else {
      setDate("");
    }

    setShowForm(true);
  };

  /* =========================================
     ICON
  ========================================= */

  const getIncomeIcon = (
    incomeSourceValue
  ) => {
    if (
      incomeSourceValue === "Salary"
    ) {
      return (
        <Briefcase size={18} />
      );
    }

    if (
      incomeSourceValue ===
      "Freelance"
    ) {
      return (
        <Wallet size={18} />
      );
    }

    if (
      incomeSourceValue === "Gift"
    ) {
      return (
        <Gift size={18} />
      );
    }

    return (
      <Banknote size={18} />
    );
  };

  /* =========================================
     SAVE
  ========================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !amount ||
      !incomeSource ||
      !date ||
      !paymentMethod
    ) {
      window.alert(
        "Please complete all required fields."
      );

      return;
    }

    const newIncome = {
      id: editingIncome
        ? editingIncome.id
        : Date.now(),

      title: title.trim(),

      amount: Number(amount),

      source: incomeSource,

      date: new Date(
        `${date}T00:00:00`
      ).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),

      paymentMethod,

      notes:
        notes.trim(),

      icon: getIncomeIcon(
        incomeSource
      ),
    };

    let updatedIncome;

    if (editingIncome) {
      updatedIncome =
        savedIncome.map(
          (item) =>
            String(item.id) ===
            String(
              editingIncome.id
            )
              ? newIncome
              : item
        );
    } else {
      updatedIncome = [
        ...savedIncome,
        newIncome,
      ];
    }

    setSavedIncome(
      updatedIncome
    );

    localStorage.setItem(
      "spendmate_income",
      JSON.stringify(
        updatedIncome
      )
    );

    /*
      Notify other pages that income changed.
    */

    window.dispatchEvent(
      new Event(
        "incomeChanged"
      )
    );

    resetForm();
  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = (income) => {
    const confirmed =
      window.confirm(
        t(
          "incomeDeleteConfirm"
        )
      );

    if (!confirmed) {
      return;
    }

    const updatedIncome =
      savedIncome.filter(
        (item) =>
          String(item.id) !==
          String(income.id)
      );

    setSavedIncome(
      updatedIncome
    );

    localStorage.setItem(
      "spendmate_income",
      JSON.stringify(
        updatedIncome
      )
    );

    window.dispatchEvent(
      new Event(
        "incomeChanged"
      )
    );
  };

  /* =========================================
     SOURCE OPTIONS
  ========================================= */

  const sourceOptions = [
    {
      value: "All Sources",
      label: t("allSources"),
    },
    {
      value: "Salary",
      label:
        getSourceLabel(
          "Salary"
        ),
    },
    {
      value: "Freelance",
      label:
        getSourceLabel(
          "Freelance"
        ),
    },
    {
      value: "Gift",
      label:
        getSourceLabel(
          "Gift"
        ),
    },
    {
      value: "Business",
      label:
        getSourceLabel(
          "Business"
        ),
    },
    {
      value: "Other",
      label:
        getSourceLabel(
          "Other"
        ),
    },
  ];

  return (
    <div className="income-page">

      {/* HEADER */}

      <div className="income-header">

        <div>

          <h1>
            {t("income")}
          </h1>

          <p>
            {t(
              "manageEarnings"
            )}
          </p>

        </div>

        <button
          type="button"
          className="add-income-btn"
          onClick={
            openAddForm
          }
        >
          <Plus size={17} />

          {t(
            "addIncome"
          )}
        </button>

      </div>

      {/* SUMMARY */}

      <div className="income-summary">

        <div className="income-summary-card">

          <span>
            {t(
              "totalIncome"
            )}
          </span>

          <h2>
            ₹
            {totalIncome.toLocaleString()}
          </h2>

          <small>
            {t(
              "recordedIncome"
            )}
          </small>

        </div>

        <div className="income-summary-card">

          <span>
            {t(
              "transactions"
            )}
          </span>

          <h2>
            {allIncome.length}
          </h2>

          <small>
            {t(
              "totalIncomeEntries"
            )}
          </small>

        </div>

        <div className="income-summary-card">

          <span>
            {t(
              "averageIncome"
            )}
          </span>

          <h2>
            ₹
            {averageIncome.toLocaleString()}
          </h2>

          <small>
            {t(
              "perTransaction"
            )}
          </small>

        </div>

        <div className="income-summary-card">

          <span>
            {t(
              "highestIncome"
            )}
          </span>

          <h2>
            ₹
            {highestIncome.toLocaleString()}
          </h2>

          <small>
            {t(
              "singleTransaction"
            )}
          </small>

        </div>

      </div>

      {/* TOOLBAR */}

      <div className="income-toolbar">

        <div className="income-search">

          <Search size={17} />

          <input
            type="text"
            placeholder={t(
              "searchIncome"
            )}
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <select
          value={source}
          onChange={(e) =>
            setSource(
              e.target.value
            )
          }
        >
          {sourceOptions.map(
            (option) => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
              >
                {
                  option.label
                }
              </option>
            )
          )}
        </select>

      </div>

      {/* TABLE */}

      <div className="income-table-card">

        <div className="income-table-header">

          <div>

            <h2>
              {t(
                "allIncome"
              )}
            </h2>

            <p>
              {
                filteredIncome.length
              }{" "}
              {t(
                "transactionsFound"
              )}
            </p>

          </div>

        </div>

        <div className="income-table">

          <div className="income-table-row income-table-heading">

            <span>
              {t("income")}
            </span>

            <span>
              {t("source")}
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

          {filteredIncome.map(
            (income) => (
              <div
                className="income-table-row"
                key={
                  income.id
                }
              >

                <div className="income-name">

                  <div className="income-icon">
                    {income.icon || (
                      <Banknote size={18} />
                    )}
                  </div>

                  <strong>
                    {
                      income.title
                    }
                  </strong>

                </div>

                <span className="income-source">
                  {getSourceLabel(
                    income.source
                  )}
                </span>

                <span className="income-date">
                  {income.date}
                </span>

                <span className="income-payment">
                  {getPaymentMethodLabel(
                    income.payment ||
                      income.paymentMethod ||
                      "Other"
                  )}
                </span>

                <strong className="income-amount">
                  + ₹
                  {Number(
                    income.amount || 0
                  ).toLocaleString()}
                </strong>

                <div className="income-action-wrapper">

                  <details className="income-details">

                    <summary className="income-more">
                      <MoreHorizontal
                        size={20}
                      />
                    </summary>

                    <div className="income-action-menu">

                      <button
                        type="button"
                        className="income-action-item edit"
                        onClick={() =>
                          openEditForm(
                            income
                          )
                        }
                      >
                        <Pencil
                          size={15}
                        />

                        {t(
                          "editIncome"
                        )}
                      </button>

                      <button
                        type="button"
                        className="income-action-item delete"
                        onClick={() =>
                          handleDelete(
                            income
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />

                        {t(
                          "deleteIncome"
                        )}
                      </button>

                    </div>

                  </details>

                </div>

              </div>
            )
          )}

          {filteredIncome.length ===
            0 && (
            <div className="no-income">
              <p>
                {t(
                  "noIncomeFound"
                )}
              </p>
            </div>
          )}

        </div>
      </div>

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <div className="income-modal-overlay">

          <div className="income-modal">

            <div className="income-modal-header">

              <div>

                <h2>
                  {editingIncome
                    ? t(
                        "editIncomeTitle"
                      )
                    : t(
                        "addIncome"
                      )}
                </h2>

                <p>
                  {editingIncome
                    ? t(
                        "updateIncomeDetails"
                      )
                    : t(
                        "recordNewIncome"
                      )}
                </p>

              </div>

              <button
                type="button"
                className="income-close-btn"
                onClick={
                  resetForm
                }
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >

              <div className="income-form-grid">

                {/* TITLE */}

                <div className="income-form-group">

                  <label>
                    {t(
                      "incomeTitle"
                    )}
                  </label>

                  <input
                    type="text"
                    placeholder={t(
                      "incomeTitleExample"
                    )}
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                {/* AMOUNT */}

                <div className="income-form-group">

                  <label>
                    {t(
                      "amount"
                    )}
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder={t(
                      "enterAmount"
                    )}
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                {/* SOURCE */}

                <div className="income-form-group">

                  <label>
                    {t("source")}
                  </label>

                  <select
                    value={
                      incomeSource
                    }
                    onChange={(e) =>
                      setIncomeSource(
                        e.target.value
                      )
                    }
                    required
                  >

                    <option value="">
                      {t(
                        "selectSource"
                      )}
                    </option>

                    <option value="Salary">
                      {getSourceLabel(
                        "Salary"
                      )}
                    </option>

                    <option value="Freelance">
                      {getSourceLabel(
                        "Freelance"
                      )}
                    </option>

                    <option value="Gift">
                      {getSourceLabel(
                        "Gift"
                      )}
                    </option>

                    <option value="Business">
                      {getSourceLabel(
                        "Business"
                      )}
                    </option>

                    <option value="Other">
                      {getSourceLabel(
                        "Other"
                      )}
                    </option>

                  </select>

                </div>

                {/* DATE */}

                <div className="income-form-group">

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
                  />

                </div>

                {/* PAYMENT */}

                <div className="income-form-group">

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

                    <option value="Other">
                      {getPaymentMethodLabel(
                        "Other"
                      )}
                    </option>

                  </select>

                </div>

                {/* NOTES */}

                <div className="income-form-group income-full">

                  <label>
                    {t(
                      "notesLabel"
                    )}
                  </label>

                  <textarea
                    rows="3"
                    placeholder={t(
                      "notesOptional"
                    )}
                    value={notes}
                    onChange={(e) =>
                      setNotes(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              <div className="income-form-actions">

                <button
                  type="button"
                  className="income-cancel-btn"
                  onClick={
                    resetForm
                  }
                >
                  {t(
                    "cancel"
                  )}
                </button>

                <button
                  type="submit"
                  className="income-save-btn"
                >
                  {editingIncome
                    ? t(
                        "updateIncome"
                      )
                    : t(
                        "saveIncome"
                      )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Income;