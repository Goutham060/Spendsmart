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
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import "../assets/styles/savingsGoals.css";

function SavingsGoals() {
  const { t } = useLanguage();

  const [savedGoals, setSavedGoals] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingGoal, setEditingGoal] =
    useState(null);

  const [name, setName] =
    useState("");

  const [target, setTarget] =
    useState("");

  const [saved, setSaved] =
    useState("");

  const [date, setDate] =
    useState("");

  /* =========================================
     LOAD SAVED GOALS
  ========================================= */

  useEffect(() => {
    try {
      const stored =
        JSON.parse(
          localStorage.getItem(
            "spendmate_savings_goals"
          )
        ) || [];

      setSavedGoals(
        Array.isArray(stored)
          ? stored
          : []
      );
    } catch {
      setSavedGoals([]);
    }
  }, []);

  /*
    IMPORTANT:
    No demo/default goals.
  */

  const allGoals = savedGoals;

  /* =========================================
     SUMMARY
  ========================================= */

  const totalTarget = useMemo(
    () =>
      allGoals.reduce(
        (sum, goal) =>
          sum +
          Number(
            goal.target || 0
          ),
        0
      ),
    [allGoals]
  );

  const totalSaved = useMemo(
    () =>
      allGoals.reduce(
        (sum, goal) =>
          sum +
          Number(
            goal.saved || 0
          ),
        0
      ),
    [allGoals]
  );

  const totalRemaining = Math.max(
    totalTarget -
      totalSaved,
    0
  );

  /* =========================================
     RESET FORM
  ========================================= */

  const resetForm = () => {
    setName("");
    setTarget("");
    setSaved("");
    setDate("");
    setEditingGoal(null);
    setShowForm(false);
  };

  /* =========================================
     ADD FORM
  ========================================= */

  const openAddForm = () => {
    setName("");
    setTarget("");
    setSaved("");
    setDate("");
    setEditingGoal(null);
    setShowForm(true);
  };

  /* =========================================
     EDIT FORM
  ========================================= */

  const openEditForm = (
    goal
  ) => {
    setEditingGoal(goal);

    setName(
      goal.name || ""
    );

    setTarget(
      goal.target || ""
    );

    setSaved(
      goal.saved || ""
    );

    const parsed =
      new Date(
        goal.date
      );

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
     SAVE GOAL
  ========================================= */

  const handleSubmit = (
    e
  ) => {
    e.preventDefault();

    const trimmedName =
      name.trim();

    const targetAmount =
      Number(target);

    const savedAmount =
      Number(saved);

    if (
      !trimmedName ||
      !Number.isFinite(
        targetAmount
      ) ||
      targetAmount <= 0 ||
      !Number.isFinite(
        savedAmount
      ) ||
      savedAmount < 0 ||
      !date
    ) {
      window.alert(
        "Please enter valid goal details."
      );

      return;
    }

    if (
      savedAmount >
      targetAmount
    ) {
      window.alert(
        "Saved amount cannot be greater than the target amount."
      );

      return;
    }

    const formattedDate =
      new Date(
        `${date}T00:00:00`
      ).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    const newGoal = {
      id: editingGoal
        ? editingGoal.id
        : Date.now(),

      name:
        trimmedName,

      target:
        targetAmount,

      saved:
        savedAmount,

      date:
        formattedDate,
    };

    let updatedGoals;

    if (editingGoal) {
      updatedGoals =
        savedGoals.map(
          (goal) =>
            String(
              goal.id
            ) ===
            String(
              editingGoal.id
            )
              ? newGoal
              : goal
        );
    } else {
      updatedGoals = [
        ...savedGoals,
        newGoal,
      ];
    }

    setSavedGoals(
      updatedGoals
    );

    localStorage.setItem(
      "spendmate_savings_goals",
      JSON.stringify(
        updatedGoals
      )
    );

    window.dispatchEvent(
      new Event(
        "savingsGoalChanged"
      )
    );

    resetForm();
  };

  /* =========================================
     DELETE GOAL
  ========================================= */

  const handleDelete = (
    goal
  ) => {
    const confirmed =
      window.confirm(
        t(
          "savingsGoalDeleteConfirm"
        ) ||
          "Are you sure you want to delete this savings goal?"
      );

    if (!confirmed) {
      return;
    }

    const updatedGoals =
      savedGoals.filter(
        (item) =>
          String(item.id) !==
          String(goal.id)
      );

    setSavedGoals(
      updatedGoals
    );

    localStorage.setItem(
      "spendmate_savings_goals",
      JSON.stringify(
        updatedGoals
      )
    );

    window.dispatchEvent(
      new Event(
        "savingsGoalChanged"
      )
    );
  };

  return (
    <div className="savings-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="savings-header">

        <div>

          <h1>
            {t(
              "savingsGoals"
            )}
          </h1>

          <p>
            {t(
              "savingsSubtitle"
            )}
          </p>

        </div>

        <button
          type="button"
          className="add-goal-btn"
          onClick={
            openAddForm
          }
        >
          <Plus size={17} />

          {t(
            "createGoal"
          )}
        </button>

      </div>


      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="savings-summary">

        <div className="savings-summary-card">

          <span>
            {t(
              "totalTarget"
            )}
          </span>

          <h2>
            ₹
            {totalTarget.toLocaleString()}
          </h2>

          <small>
            {t(
              "acrossAllGoals"
            )}
          </small>

        </div>


        <div className="savings-summary-card">

          <span>
            {t(
              "totalSaved"
            )}
          </span>

          <h2 className="saved-value">
            ₹
            {totalSaved.toLocaleString()}
          </h2>

          <small>
            {t(
              "currentSavings"
            )}
          </small>

        </div>


        <div className="savings-summary-card">

          <span>
            {t(
              "remaining"
            )}
          </span>

          <h2>
            ₹
            {totalRemaining.toLocaleString()}
          </h2>

          <small>
            {t(
              "stillNeeded"
            )}
          </small>

        </div>


        <div className="savings-summary-card">

          <span>
            {t(
              "savingsGoals"
            )}
          </span>

          <h2>
            {allGoals.length}
          </h2>

          <small>
            {t(
              "activeGoals"
            )}
          </small>

        </div>

      </div>


      {/* =====================================
          GOALS SECTION
      ====================================== */}

      <div className="savings-section-header">

        <div>

          <h2>
            {t(
              "yourGoals"
            )}
          </h2>

          <p>
            {t(
              "trackGoalProgress"
            )}
          </p>

        </div>

      </div>


      {/* =====================================
          GOALS GRID
      ====================================== */}

      <div className="savings-grid">

        {allGoals.map(
          (goal) => {

            const targetAmount =
              Number(
                goal.target || 0
              );

            const savedAmount =
              Number(
                goal.saved || 0
              );

            const percentage =
              targetAmount >
              0
                ? Math.round(
                    (savedAmount /
                      targetAmount) *
                      100
                  )
                : 0;

            const progress =
              Math.min(
                percentage,
                100
              );

            return (
              <div
                className="savings-card"
                key={
                  goal.id
                }
              >

                {/* TOP */}

                <div className="savings-card-top">

                  <div className="goal-title">

                    <div className="goal-icon">
                      <Target
                        size={19}
                      />
                    </div>

                    <div>

                      <strong>
                        {goal.name}
                      </strong>

                      <span>
                        {t(
                          "targetDate"
                        )}
                        :{" "}
                        {goal.date}
                      </span>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <details className="goal-details">

                    <summary className="goal-more">
                      <MoreHorizontal
                        size={19}
                      />
                    </summary>

                    <div className="goal-action-menu">

                      <button
                        type="button"
                        className="goal-action-item edit"
                        onClick={() =>
                          openEditForm(
                            goal
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
                        className="goal-action-item delete"
                        onClick={() =>
                          handleDelete(
                            goal
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


                {/* AMOUNTS */}

                <div className="goal-amount-row">

                  <div>

                    <span>
                      {t(
                        "saved"
                      )}
                    </span>

                    <strong>
                      ₹
                      {savedAmount.toLocaleString()}
                    </strong>

                  </div>


                  <div>

                    <span>
                      {t(
                        "target"
                      )}
                    </span>

                    <strong>
                      ₹
                      {targetAmount.toLocaleString()}
                    </strong>

                  </div>

                </div>


                {/* PROGRESS */}

                <div className="goal-progress">

                  <div className="goal-progress-track">

                    <div
                      className="goal-progress-fill"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>


                  <div className="goal-progress-label">

                    <span>
                      {percentage}%{" "}
                      {t(
                        "complete"
                      )}
                    </span>

                    <span>
                      ₹
                      {Math.max(
                        targetAmount -
                          savedAmount,
                        0
                      ).toLocaleString()}{" "}
                      {t("left")}
                    </span>

                  </div>

                </div>

              </div>
            );
          }
        )}


        {/* EMPTY STATE */}

        {allGoals.length ===
          0 && (

          <div className="no-goals">

            <Target
              size={30}
            />

            <h3>
              No savings goals yet
            </h3>

            <p>
              Create your first savings
              goal to start tracking
              your progress.
            </p>

          </div>

        )}

      </div>


      {/* =====================================
          MODAL
      ====================================== */}

      {showForm && (

        <div className="goal-modal-overlay">

          <div className="goal-modal">

            <div className="goal-modal-header">

              <div>

                <h2>
                  {editingGoal
                    ? t(
                        "editSavingsGoal"
                      )
                    : t(
                        "createSavingsGoal"
                      )}
                </h2>

                <p>
                  {t(
                    "goalDescription"
                  )}
                </p>

              </div>

              <button
                type="button"
                className="goal-close-btn"
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

              {/* GOAL NAME */}

              <div className="goal-form-group">

                <label>
                  {t(
                    "goalName"
                  )}
                </label>

                <input
                  type="text"
                  placeholder="Example: New Laptop"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* TARGET */}

              <div className="goal-form-group">

                <label>
                  {t(
                    "targetAmount"
                  )}
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Example: 60000"
                  value={target}
                  onChange={(e) =>
                    setTarget(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* CURRENT SAVED */}

              <div className="goal-form-group">

                <label>
                  {t(
                    "currentSavedAmount"
                  )}
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Example: 10000"
                  value={saved}
                  onChange={(e) =>
                    setSaved(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* TARGET DATE */}

              <div className="goal-form-group">

                <label>
                  {t(
                    "targetDate"
                  )}
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


              {/* ACTIONS */}

              <div className="goal-form-actions">

                <button
                  type="button"
                  className="goal-cancel-btn"
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
                  className="goal-save-btn"
                >
                  {editingGoal
                    ? t(
                        "updateGoal"
                      )
                    : t(
                        "createGoal"
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

export default SavingsGoals;