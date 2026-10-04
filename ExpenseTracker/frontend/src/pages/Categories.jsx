import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Utensils,
  ShoppingBag,
  Car,
  Film,
  BookOpen,
  Receipt,
  HeartPulse,
  Tag,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import {
  getStoredCategories,
  getCategoryLabel,
} from "../utils/categoryUtils";

import "../assets/styles/categories.css";

const defaultCategories = [
  {
    id: "default-food",
    name: "Food",
    icon: "food",
    default: true,
  },
  {
    id: "default-shopping",
    name: "Shopping",
    icon: "shopping",
    default: true,
  },
  {
    id: "default-travel",
    name: "Travel",
    icon: "travel",
    default: true,
  },
  {
    id: "default-entertainment",
    name: "Entertainment",
    icon: "entertainment",
    default: true,
  },
  {
    id: "default-education",
    name: "Education",
    icon: "education",
    default: true,
  },
  {
    id: "default-bills",
    name: "Bills",
    icon: "bills",
    default: true,
  },
  {
    id: "default-health",
    name: "Health",
    icon: "health",
    default: true,
  },
  {
    id: "default-other",
    name: "Other",
    icon: "other",
    default: true,
  },
];

function Categories() {
  const { t } = useLanguage();

  const [customCategories, setCustomCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  /* =========================================
     LOAD DATA
  ========================================= */

  useEffect(() => {
    try {
      const savedCategories =
        JSON.parse(
          localStorage.getItem("spendmate_categories")
        ) || [];

      const savedExpenses =
        JSON.parse(
          localStorage.getItem("spendmate_expenses")
        ) || [];

      setCustomCategories(savedCategories);
      setExpenses(savedExpenses);
    } catch {
      setCustomCategories([]);
      setExpenses([]);
    }
  }, []);

  /*
    getStoredCategories() returns:
    - 8 default categories
    - custom categories created by the user
  */

  const storedCategoryNames = getStoredCategories();

  const allCategories = useMemo(() => {
    const customCategoryObjects = storedCategoryNames
      .filter(
        (name) =>
          !defaultCategories.some(
            (defaultCategory) =>
              defaultCategory.name.toLowerCase() ===
              name.toLowerCase()
          )
      )
      .map((name) => {
        const existingCustom =
          customCategories.find(
            (category) =>
              category.name.toLowerCase() ===
              name.toLowerCase()
          );

        return (
          existingCustom || {
            id: `custom-${name}`,
            name,
            icon: "other",
            default: false,
          }
        );
      });

    return [
      ...defaultCategories,
      ...customCategoryObjects,
    ];
  }, [storedCategoryNames, customCategories]);

  /* =========================================
     TOTAL SPENDING
  ========================================= */

  const totalSpent = useMemo(() => {
    return expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  /* =========================================
     CATEGORY ICON
  ========================================= */

  const getCategoryIcon = (icon) => {
    const icons = {
      food: <Utensils size={20} />,
      shopping: <ShoppingBag size={20} />,
      travel: <Car size={20} />,
      entertainment: <Film size={20} />,
      education: <BookOpen size={20} />,
      bills: <Receipt size={20} />,
      health: <HeartPulse size={20} />,
      other: <Tag size={20} />,
    };

    return icons[icon] || <Tag size={20} />;
  };

  /* =========================================
     CATEGORY STATS
  ========================================= */

  const getCategoryStats = (name) => {
    const categoryExpenses = expenses.filter(
      (expense) =>
        String(expense.category || "").toLowerCase() ===
        String(name || "").toLowerCase()
    );

    const spent = categoryExpenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );

    return {
      spent,
      transactions: categoryExpenses.length,
    };
  };

  /* =========================================
     ADD CATEGORY
  ========================================= */

  const openAddForm = () => {
    setEditingCategory(null);
    setCategoryName("");
    setShowForm(true);
  };

  /* =========================================
     EDIT CATEGORY
  ========================================= */

  const openEditForm = (category) => {
    if (category.default) {
      window.alert(t("defaultCannotEdit"));
      return;
    }

    setEditingCategory(category);
    setCategoryName(category.name);
    setShowForm(true);
  };

  /* =========================================
     RESET FORM
  ========================================= */

  const resetForm = () => {
    setCategoryName("");
    setEditingCategory(null);
    setShowForm(false);
  };

  /* =========================================
     SAVE CATEGORY
  ========================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = categoryName.trim();

    if (!trimmedName) return;

    const alreadyExists = allCategories.some(
      (category) =>
        category.name.toLowerCase() ===
          trimmedName.toLowerCase() &&
        (!editingCategory ||
          String(category.id) !==
            String(editingCategory.id))
    );

    if (alreadyExists) {
      window.alert(t("duplicateCategory"));
      return;
    }

    /* =====================================
       EDIT EXISTING CATEGORY
    ===================================== */

    if (editingCategory) {
      const oldName = editingCategory.name;

      const newCategory = {
        id: editingCategory.id,
        name: trimmedName,
        icon: editingCategory.icon || "other",
        default: false,
      };

      const updatedCategories =
        customCategories.map((category) =>
          String(category.id) ===
          String(editingCategory.id)
            ? newCategory
            : category
        );

      setCustomCategories(updatedCategories);

      localStorage.setItem(
        "spendmate_categories",
        JSON.stringify(updatedCategories)
      );

      /*
        Update existing expenses so they continue
        to belong to the renamed category.
      */

      if (
        oldName.toLowerCase() !==
        trimmedName.toLowerCase()
      ) {
        const updatedExpenses = expenses.map(
          (expense) =>
            String(expense.category || "").toLowerCase() ===
            oldName.toLowerCase()
              ? {
                  ...expense,
                  category: trimmedName,
                  icon: "other",
                }
              : expense
        );

        setExpenses(updatedExpenses);

        localStorage.setItem(
          "spendmate_expenses",
          JSON.stringify(updatedExpenses)
        );
      }

      resetForm();
      return;
    }

    /* =====================================
       ADD NEW CATEGORY
    ===================================== */

    const newCategory = {
      id: Date.now(),
      name: trimmedName,
      icon: "other",
      default: false,
    };

    const updatedCategories = [
      ...customCategories,
      newCategory,
    ];

    setCustomCategories(updatedCategories);

    localStorage.setItem(
      "spendmate_categories",
      JSON.stringify(updatedCategories)
    );

    resetForm();
  };

  /* =========================================
     DELETE CATEGORY
  ========================================= */

  const handleDelete = (category) => {
    if (category.default) {
      window.alert(t("defaultCannotDelete"));
      return;
    }

    const stats = getCategoryStats(category.name);

    let confirmed;

    if (stats.transactions > 0) {
      confirmed = window.confirm(
        t("categoryHasExpensesConfirm", {
          category: category.name,
          count: stats.transactions,
        })
      );
    } else {
      confirmed = window.confirm(
        t("deleteCategoryConfirm", {
          category: category.name,
        })
      );
    }

    if (!confirmed) return;

    const updatedCategories =
      customCategories.filter(
        (item) =>
          String(item.id) !==
          String(category.id)
      );

    setCustomCategories(updatedCategories);

    localStorage.setItem(
      "spendmate_categories",
      JSON.stringify(updatedCategories)
    );
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="categories-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="categories-header">
        <div>
          <h1>{t("categories")}</h1>

          <p>{t("categoriesSubtitle")}</p>
        </div>

        <button
          type="button"
          className="add-category-btn"
          onClick={openAddForm}
        >
          <Plus size={17} />

          {t("addCategory")}
        </button>
      </div>

      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="categories-summary">

        <div className="category-summary-card">
          <span>{t("totalCategories")}</span>

          <h2>{allCategories.length}</h2>

          <small>
            {t("availableCategories")}
          </small>
        </div>

        <div className="category-summary-card">
          <span>{t("customCategories")}</span>

          <h2>{customCategories.length}</h2>

          <small>
            {t("createdByYou")}
          </small>
        </div>

        <div className="category-summary-card">
          <span>{t("totalSpending")}</span>

          <h2>
            ₹{totalSpent.toLocaleString()}
          </h2>

          <small>
            {t("acrossAllCategories")}
          </small>
        </div>

      </div>

      {/* =====================================
          SECTION HEADER
      ====================================== */}

      <div className="categories-section-header">
        <div>
          <h2>{t("allCategories")}</h2>

          <p>
            {t("trackCategorySpending")}
          </p>
        </div>
      </div>

      {/* =====================================
          CATEGORY GRID
      ====================================== */}

      <div className="categories-grid">

        {allCategories.map((category) => {
          const stats = getCategoryStats(
            category.name
          );

          return (
            <div
              className="category-card"
              key={category.id}
            >

              <div className="category-card-top">

                <div className="category-icon">
                  {getCategoryIcon(
                    category.icon
                  )}
                </div>

                <details className="category-details">

                  <summary className="category-more">
                    <MoreHorizontal size={19} />
                  </summary>

                  <div className="category-action-menu">

                    {!category.default && (
                      <button
                        type="button"
                        className="category-action-item edit"
                        onClick={() =>
                          openEditForm(category)
                        }
                      >
                        <Pencil size={14} />

                        {t("edit")}
                      </button>
                    )}

                    <button
                      type="button"
                      className="category-action-item delete"
                      onClick={() =>
                        handleDelete(category)
                      }
                    >
                      <Trash2 size={14} />

                      {t("delete")}
                    </button>

                  </div>
                </details>

              </div>

              <h3>
                {getCategoryLabel(
                  category.name,
                  t
                )}
              </h3>

              <div className="category-stats">

                <div>
                  <span>
                    {t("spent")}
                  </span>

                  <strong>
                    ₹{stats.spent.toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>
                    {t("transactions")}
                  </span>

                  <strong>
                    {stats.transactions}
                  </strong>
                </div>

              </div>

              <div className="category-status">
                {category.default
                  ? t("defaultCategory")
                  : t("customCategory")}
              </div>

            </div>
          );
        })}

      </div>

      {/* =====================================
          ADD / EDIT MODAL
      ====================================== */}

      {showForm && (
        <div className="category-modal-overlay">

          <div className="category-modal">

            <div className="category-modal-header">

              <div>
                <h2>
                  {editingCategory
                    ? t("editCategoryTitle")
                    : t("addCategoryTitle")}
                </h2>

                <p>
                  {t("categoryDescription")}
                </p>
              </div>

              <button
                type="button"
                className="category-close-btn"
                onClick={resetForm}
              >
                <X size={19} />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="category-form-group">

                <label>
                  {t("categoryName")}
                </label>

                <input
                  type="text"
                  placeholder={t(
                    "categoryExample"
                  )}
                  value={categoryName}
                  onChange={(e) =>
                    setCategoryName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="category-form-actions">

                <button
                  type="button"
                  className="category-cancel-btn"
                  onClick={resetForm}
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  className="category-save-btn"
                >
                  {editingCategory
                    ? t("updateCategory")
                    : t("addCategory")}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Categories;