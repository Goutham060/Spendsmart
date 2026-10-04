import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Target,
  Utensils,
  ShoppingBag,
  Car,
  Film,
  BookOpen,
  Receipt,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import {
  getStoredCategories,
  getCategoryLabel,
} from "../utils/categoryUtils";

import "../assets/styles/budgets.css";

function Budgets() {
  const { t } = useLanguage();

  const [savedBudgets, setSavedBudgets] =
    useState([]);

  const [expenses, setExpenses] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingBudget, setEditingBudget] =
    useState(null);

  const [budgetCategory, setBudgetCategory] =
    useState("");

  const [budgetLimit, setBudgetLimit] =
    useState("");

  const [loadingExpenses, setLoadingExpenses] =
    useState(true);

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
     LOAD BUDGETS
  ========================================= */

  useEffect(() => {
    try {
      const budgets =
        JSON.parse(
          localStorage.getItem(
            "spendmate_budgets"
          )
        ) || [];

      setSavedBudgets(
        Array.isArray(budgets)
          ? budgets
          : []
      );
    } catch {
      setSavedBudgets([]);
    }
  }, []);

  /* =========================================
     LOAD EXPENSES FROM BACKEND
  ========================================= */

  const loadExpenses = async () => {
    const user = getUser();

    if (!user?.id) {
      setExpenses([]);
      setLoadingExpenses(false);
      return;
    }

    try {
      setLoadingExpenses(true);

      const response =
        await fetch(
          `http://localhost:8080/api/expenses?userId=${encodeURIComponent(
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

      const data =
        await response.json();

      setExpenses(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Budget expense loading failed:",
        error
      );

      setExpenses([]);
    } finally {
      setLoadingExpenses(false);
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
     ONLY REAL BUDGETS
  ========================================= */

  const allBudgets = savedBudgets;

  /* =========================================
     CATEGORY OPTIONS
  ========================================= */

  const categoryOptions =
    getStoredCategories();

  /* =========================================
     CATEGORY ICON
  ========================================= */

  const getCategoryIcon = (
    category
  ) => {
    const icons = {
      Food: (
        <Utensils size={18} />
      ),

      Shopping: (
        <ShoppingBag size={18} />
      ),

      Travel: (
        <Car size={18} />
      ),

      Entertainment: (
        <Film size={18} />
      ),

      Education: (
        <BookOpen size={18} />
      ),

      Bills: (
        <Receipt size={18} />
      ),

      Health: (
        <Target size={18} />
      ),

      Other: (
        <Target size={18} />
      ),
    };

    return (
      icons[category] || (
        <Target size={18} />
      )
    );
  };

  /* =========================================
     CATEGORY LABEL
  ========================================= */

  const getBudgetCategoryLabel = (
    category
  ) => {
    return getCategoryLabel(
      category,
      t
    );
  };

  /* =========================================
     SPENT AMOUNT
  ========================================= */

  const getSpentAmount = (
    category
  ) => {
    return expenses
      .filter(
        (expense) =>
          expense.category ===
          category
      )
      .reduce(
        (sum, expense) =>
          sum +
          Number(
            expense.amount || 0
          ),
        0
      );
  };

  /* =========================================
     SUMMARY
  ========================================= */

  const totalBudget = useMemo(() => {
    return allBudgets.reduce(
      (sum, budget) =>
        sum +
        Number(
          budget.limit || 0
        ),
      0
    );
  }, [savedBudgets]);

  const totalSpent = useMemo(() => {
    const uniqueCategories =
      [
        ...new Set(
          allBudgets.map(
            (budget) =>
              budget.category
          )
        ),
      ];

    return uniqueCategories.reduce(
      (sum, category) =>
        sum +
        getSpentAmount(
          category
        ),
      0
    );
  }, [
    savedBudgets,
    expenses,
  ]);

  const totalRemaining =
    totalBudget - totalSpent;

  /* =========================================
     RESET FORM
  ========================================= */

  const resetForm = () => {
    setBudgetCategory("");
    setBudgetLimit("");
    setEditingBudget(null);
    setShowForm(false);
  };

  /* =========================================
     ADD FORM
  ========================================= */

  const openAddForm = () => {
    setEditingBudget(null);
    setBudgetCategory("");
    setBudgetLimit("");
    setShowForm(true);
  };

  /* =========================================
     EDIT FORM
  ========================================= */

  const openEditForm = (
    budget
  ) => {
    setEditingBudget(budget);

    setBudgetCategory(
      budget.category || ""
    );

    setBudgetLimit(
      budget.limit || ""
    );

    setShowForm(true);
  };

  /* =========================================
     SAVE BUDGET
  ========================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedCategory =
      budgetCategory.trim();

    const numericLimit =
      Number(budgetLimit);

    if (
      !trimmedCategory ||
      !Number.isFinite(
        numericLimit
      ) ||
      numericLimit <= 0
    ) {
      window.alert(
        "Please enter a valid category and budget amount."
      );

      return;
    }

    /*
      Prevent duplicate category budgets.
    */

    const duplicate =
      savedBudgets.some(
        (budget) =>
          budget.category
            ?.toLowerCase() ===
            trimmedCategory.toLowerCase() &&
          String(
            budget.id
          ) !==
            String(
              editingBudget?.id
            )
      );

    if (duplicate) {
      window.alert(
        "A budget for this category already exists."
      );

      return;
    }

    const newBudget = {
      id: editingBudget
        ? editingBudget.id
        : Date.now(),

      category:
        trimmedCategory,

      limit:
        numericLimit,
    };

    let updatedBudgets;

    if (editingBudget) {
      updatedBudgets =
        savedBudgets.map(
          (budget) =>
            String(
              budget.id
            ) ===
            String(
              editingBudget.id
            )
              ? newBudget
              : budget
        );
    } else {
      updatedBudgets = [
        ...savedBudgets,
        newBudget,
      ];
    }

    setSavedBudgets(
      updatedBudgets
    );

    localStorage.setItem(
      "spendmate_budgets",
      JSON.stringify(
        updatedBudgets
      )
    );

    window.dispatchEvent(
      new Event(
        "budgetChanged"
      )
    );

    resetForm();
  };

  /* =========================================
     DELETE BUDGET
  ========================================= */

  const handleDelete = (
    budget
  ) => {
    const confirmed =
      window.confirm(
        t(
          "confirmDeleteBudget"
        ) ||
          "Are you sure you want to delete this budget?"
      );

    if (!confirmed) {
      return;
    }

    const updatedBudgets =
      savedBudgets.filter(
        (item) =>
          String(item.id) !==
          String(budget.id)
      );

    setSavedBudgets(
      updatedBudgets
    );

    localStorage.setItem(
      "spendmate_budgets",
      JSON.stringify(
        updatedBudgets
      )
    );

    window.dispatchEvent(
      new Event(
        "budgetChanged"
      )
    );
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="budgets-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="budgets-header">

        <div>

          <h1>
            {t("budgets")}
          </h1>

          <p>
            {t(
              "budgetSubtitle"
            )}
          </p>

        </div>

        <button
          type="button"
          className="add-budget-btn"
          onClick={
            openAddForm
          }
        >
          <Plus size={17} />

          {t(
            "createBudget"
          )}
        </button>

      </div>


      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="budget-summary">

        <div className="budget-summary-card">

          <span>
            {t(
              "totalBudget"
            )}
          </span>

          <h2>
            ₹
            {totalBudget.toLocaleString()}
          </h2>

          <small>
            {t(
              "acrossCategories"
            )}
          </small>

        </div>


        <div className="budget-summary-card">

          <span>
            {t(
              "totalSpent"
            )}
          </span>

          <h2 className="budget-spent">
            ₹
            {totalSpent.toLocaleString()}
          </h2>

          <small>
            {t(
              "againstBudgets"
            )}
          </small>

        </div>


        <div className="budget-summary-card">

          <span>
            {t(
              "remaining"
            )}
          </span>

          <h2
            className={
              totalRemaining >= 0
                ? "budget-remaining"
                : "budget-danger"
            }
          >
            ₹
            {totalRemaining.toLocaleString()}
          </h2>

          <small>
            {t(
              "availableBudget"
            )}
          </small>

        </div>


        <div className="budget-summary-card">

          <span>
            {t(
              "categories"
            )}
          </span>

          <h2>
            {allBudgets.length}
          </h2>

          <small>
            {t(
              "activeBudgets"
            )}
          </small>

        </div>

      </div>


      {/* =====================================
          BUDGET SECTION
      ====================================== */}

      <div className="budget-section-header">

        <div>

          <h2>
            {t(
              "yourBudgets"
            )}
          </h2>

          <p>
            {t(
              "monitorBudgets"
            )}
          </p>

        </div>

      </div>


      {/* =====================================
          BUDGET GRID
      ====================================== */}

      {loadingExpenses ? (
        <div className="no-budgets">
          <Target size={30} />

          <h3>
            Loading spending data...
          </h3>
        </div>
      ) : (
        <div className="budget-grid">

          {allBudgets.map(
            (budget) => {

              const spent =
                getSpentAmount(
                  budget.category
                );

              const limit =
                Number(
                  budget.limit || 0
                );

              const percentage =
                limit > 0
                  ? Math.round(
                      (spent /
                        limit) *
                        100
                    )
                  : 0;

              const progress =
                Math.min(
                  percentage,
                  100
                );

              let status =
                t("onTrack");

              if (
                percentage >= 100
              ) {
                status =
                  t(
                    "budgetExceeded"
                  );
              } else if (
                percentage >= 80
              ) {
                status =
                  t(
                    "almostReached"
                  );
              }

              return (
                <div
                  className="budget-card"
                  key={
                    budget.id
                  }
                >

                  {/* TOP */}

                  <div className="budget-card-top">

                    <div className="budget-category">

                      <div className="budget-icon">

                        {getCategoryIcon(
                          budget.category
                        )}

                      </div>

                      <div>

                        <strong>
                          {getBudgetCategoryLabel(
                            budget.category
                          )}
                        </strong>

                        <span>
                          {t(
                            "monthlyBudget"
                          )}
                        </span>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="budget-actions">

                      <details className="budget-details">

                        <summary className="budget-more">
                          <MoreHorizontal
                            size={19}
                          />
                        </summary>

                        <div className="budget-action-menu">

                          <button
                            type="button"
                            className="budget-action-item edit"
                            onClick={() =>
                              openEditForm(
                                budget
                              )
                            }
                          >
                            <Pencil
                              size={14}
                            />

                            {t(
                              "edit"
                            )}
                          </button>

                          <button
                            type="button"
                            className="budget-action-item delete"
                            onClick={() =>
                              handleDelete(
                                budget
                              )
                            }
                          >
                            <Trash2
                              size={14}
                            />

                            {t(
                              "delete"
                            )}
                          </button>

                        </div>

                      </details>

                    </div>

                  </div>


                  {/* AMOUNTS */}

                  <div className="budget-amounts">

                    <div>

                      <span>
                        {t(
                          "spent"
                        )}
                      </span>

                      <strong>
                        ₹
                        {spent.toLocaleString()}
                      </strong>

                    </div>

                    <div>

                      <span>
                        {t(
                          "limit"
                        )}
                      </span>

                      <strong>
                        ₹
                        {limit.toLocaleString()}
                      </strong>

                    </div>

                  </div>


                  {/* PROGRESS */}

                  <div className="budget-progress">

                    <div className="budget-progress-track">

                      <div
                        className={`budget-progress-fill ${
                          percentage >=
                          100
                            ? "danger"
                            : percentage >=
                              80
                            ? "warning"
                            : ""
                        }`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />

                    </div>

                    <div className="budget-progress-label">

                      <span>
                        {percentage}%{" "}
                        {t(
                          "used"
                        )}
                      </span>

                      <span
                        className={
                          percentage >=
                          100
                            ? "status-danger"
                            : percentage >=
                              80
                            ? "status-warning"
                            : "status-good"
                        }
                      >
                        {status}
                      </span>

                    </div>

                  </div>


                  {/* REMAINING */}

                  <div className="budget-remaining">

                    {spent >=
                    limit ? (

                      <span className="remaining-danger">
                        ₹
                        {Math.abs(
                          limit -
                            spent
                        ).toLocaleString()}{" "}
                        {t(
                          "overBudget"
                        )}
                      </span>

                    ) : (

                      <span>
                        ₹
                        {(
                          limit -
                          spent
                        ).toLocaleString()}{" "}
                        {t("left")}
                      </span>

                    )}

                  </div>

                </div>
              );
            }
          )}


          {/* EMPTY STATE */}

          {allBudgets.length ===
            0 && (

            <div className="no-budgets">

              <Target
                size={30}
              />

              <h3>
                {t(
                  "noBudgetsYet"
                )}
              </h3>

              <p>
                {t(
                  "createFirstBudget"
                )}
              </p>

            </div>

          )}

        </div>
      )}


      {/* =====================================
          ADD / EDIT MODAL
      ====================================== */}

      {showForm && (

        <div className="budget-modal-overlay">

          <div className="budget-modal">

            <div className="budget-modal-header">

              <div>

                <h2>
                  {editingBudget
                    ? t(
                        "editBudgetTitle"
                      )
                    : t(
                        "createBudgetTitle"
                      )}
                </h2>

                <p>
                  {t(
                    "budgetDescription"
                  )}
                </p>

              </div>

              <button
                type="button"
                className="budget-close-btn"
                onClick={
                  resetForm
                }
              >
                <X size={19} />
              </button>

            </div>


            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* CATEGORY */}

              <div className="budget-form-group">

                <label>
                  {t(
                    "categoryLabel"
                  )}
                </label>

                <select
                  value={
                    budgetCategory
                  }
                  onChange={(e) =>
                    setBudgetCategory(
                      e.target.value
                    )
                  }
                  required
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


              {/* MONTHLY BUDGET */}

              <div className="budget-form-group">

                <label>
                  {t(
                    "monthlyBudget"
                  )}
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder={t(
                    "budgetExample"
                  )}
                  value={
                    budgetLimit
                  }
                  onChange={(e) =>
                    setBudgetLimit(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* BUTTONS */}

              <div className="budget-form-actions">

                <button
                  type="button"
                  className="budget-cancel-btn"
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
                  className="budget-save-btn"
                >
                  {editingBudget
                    ? t(
                        "updateBudget"
                      )
                    : t(
                        "createBudgetBtn"
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

export default Budgets;