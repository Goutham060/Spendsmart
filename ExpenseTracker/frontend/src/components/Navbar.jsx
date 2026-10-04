import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  Receipt,
  Wallet,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

import "../assets/styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [searchText, setSearchText] =
    useState(() => {
      return (
        localStorage.getItem(
          "spendmate_expenses_search"
        ) || ""
      );
    });

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);

  const [notifications, setNotifications] =
    useState([]);

  const user =
    JSON.parse(
      localStorage.getItem(
        "spendmate_user"
      )
    ) || {};

  /* =========================================
     LOAD NOTIFICATIONS SETTING
  ========================================= */

  const loadNotificationSetting = () => {
    try {
      const settings =
        JSON.parse(
          localStorage.getItem(
            "spendmate_settings"
          )
        ) || {};

      setNotificationsEnabled(
        settings.notifications !==
          undefined
          ? settings.notifications
          : true
      );
    } catch {
      setNotificationsEnabled(true);
    }
  };

  /* =========================================
     BUILD NOTIFICATIONS
  ========================================= */

  const loadNotifications = () => {
    try {
      const expenses =
        JSON.parse(
          localStorage.getItem(
            "spendmate_expenses"
          )
        ) || [];

      const income =
        JSON.parse(
          localStorage.getItem(
            "spendmate_income"
          )
        ) || [];

      const generated = [];

      /* =====================================
         LATEST EXPENSE
      ====================================== */

      if (expenses.length > 0) {
        const latestExpense =
          expenses[
            expenses.length - 1
          ];

        generated.push({
          id: `expense-${latestExpense.id}`,
          type: "expense",
          title: t("newExpenseNotification"),
          message: `${latestExpense.title} • ₹${Number(
            latestExpense.amount || 0
          ).toLocaleString()}`,
          time:
            latestExpense.date ||
            "",
        });
      }

      /* =====================================
         LATEST INCOME
      ====================================== */

      if (income.length > 0) {
        const latestIncome =
          income[
            income.length - 1
          ];

        generated.push({
          id: `income-${latestIncome.id}`,
          type: "income",
          title: t("newIncomeNotification"),
          message: `₹${Number(
            latestIncome.amount || 0
          ).toLocaleString()}`,
          time:
            latestIncome.date ||
            "",
        });
      }

      /*
        Keep only the two latest activities.
      */

      setNotifications(
        generated.slice(0, 2)
      );
    } catch {
      setNotifications([]);
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    loadNotificationSetting();
    loadNotifications();
  }, [language]);

  /* =========================================
     SETTINGS / DATA SYNC
  ========================================= */

  useEffect(() => {
    const handleNotificationChange = () => {
      loadNotificationSetting();
      loadNotifications();
    };

    const handleStorageChange = () => {
      loadNotificationSetting();
      loadNotifications();
    };

    window.addEventListener(
      "notificationsChanged",
      handleNotificationChange
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "notificationsChanged",
        handleNotificationChange
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [language]);

  /* =========================================
     LANGUAGE LABEL
  ========================================= */

  const getLanguageLabel = () => {
    if (language === "Telugu") {
      return "తెలుగు";
    }

    if (language === "Hindi") {
      return "हिन्दी";
    }

    return "English";
  };

  /* =========================================
     SEARCH TEXT
  ========================================= */

  const getSearchText = () => {
    if (language === "Telugu") {
      return "శోధించండి...";
    }

    if (language === "Hindi") {
      return "खोजें...";
    }

    return "Search...";
  };

  /* =========================================
     USER LABEL
  ========================================= */

  const getUserLabel = () => {
    if (language === "Telugu") {
      return "స్పెండ్‌మేట్ వినియోగదారు";
    }

    if (language === "Hindi") {
      return "स्पेंडमेट उपयोगकर्ता";
    }

    return "SpendMate User";
  };

  /* =========================================
     CHANGE LANGUAGE LABEL
  ========================================= */

  const getChangeLanguageText = () => {
    if (language === "Telugu") {
      return "భాష మార్చండి";
    }

    if (language === "Hindi") {
      return "भाषा बदलें";
    }

    return "Change language";
  };

  /* =========================================
     SEARCH
  ========================================= */

  const handleSearch = () => {
    const trimmedSearch =
      searchText.trim();

    localStorage.setItem(
      "spendmate_expenses_search",
      trimmedSearch
    );

    navigate("/expenses");
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* =========================================
     NOTIFICATIONS
  ========================================= */

  const handleNotificationsClick = () => {
    if (!notificationsEnabled) {
      setShowNotifications(
        (current) => !current
      );
      return;
    }

    loadNotifications();

    setShowNotifications(
      (current) => !current
    );

    localStorage.setItem(
      "spendmate_notifications_seen",
      "true"
    );
  };

  const handleViewExpenses = () => {
    setShowNotifications(false);
    navigate("/expenses");
  };

  /* =========================================
     USER
  ========================================= */

  const userName =
    user.name || "User";

  const firstLetter =
    userName
      .charAt(0)
      .toUpperCase();

  return (
    <header className="navbar">

      {/* =====================================
          LEFT
      ====================================== */}

      <div className="navbar-left">

        <div className="navbar-search">

          <Search size={17} />

          <input
            type="text"
            placeholder={getSearchText()}
            value={searchText}
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
            onKeyDown={
              handleSearchKeyDown
            }
            aria-label={getSearchText()}
          />

        </div>

      </div>

      {/* =====================================
          RIGHT
      ====================================== */}

      <div className="navbar-right">

        {/* LANGUAGE */}

        <button
          type="button"
          className="navbar-language"
          onClick={() =>
            navigate("/settings")
          }
          title={
            getChangeLanguageText()
          }
        >
          {getLanguageLabel()}
        </button>

        {/* ===================================
            NOTIFICATIONS
        ==================================== */}

        <div className="navbar-notification-wrapper">

          <button
            type="button"
            className="navbar-icon-btn"
            title={t(
              "notifications"
            )}
            aria-label={t(
              "notifications"
            )}
            onClick={
              handleNotificationsClick
            }
            aria-expanded={
              showNotifications
            }
          >
            <Bell size={19} />

            {notificationsEnabled &&
              notifications.length >
                0 && (
                <span className="notification-dot"></span>
              )}
          </button>

          {showNotifications && (
            <div className="notification-panel">

              <div className="notification-panel-header">

                <div>
                  <h3>
                    {t(
                      "notifications"
                    )}
                  </h3>

                  <p>
                    {notificationsEnabled
                      ? t(
                          "recentActivity"
                        )
                      : t(
                          "notificationsOff"
                        )}
                  </p>
                </div>

              </div>

              {!notificationsEnabled ? (
                <div className="notification-empty">

                  <Bell size={24} />

                  <p>
                    {t(
                      "notificationsOff"
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(
                        false
                      );
                      navigate(
                        "/settings"
                      );
                    }}
                  >
                    {t(
                      "settings"
                    )}
                  </button>

                </div>
              ) : notifications.length === 0 ? (
                <div className="notification-empty">

                  <Check size={24} />

                  <p>
                    {t(
                      "noNotifications"
                    )}
                  </p>

                </div>
              ) : (
                <>
                  <div className="notification-list">

                    {notifications.map(
                      (notification) => (
                        <div
                          className="notification-item"
                          key={
                            notification.id
                          }
                        >

                          <div className="notification-item-icon">

                            {notification.type ===
                            "income" ? (
                              <Wallet
                                size={17}
                              />
                            ) : (
                              <Receipt
                                size={17}
                              />
                            )}

                          </div>

                          <div className="notification-item-content">

                            <strong>
                              {
                                notification.title
                              }
                            </strong>

                            <p>
                              {
                                notification.message
                              }
                            </p>

                            <span>
                              {
                                notification.time
                              }
                            </span>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                  <button
                    type="button"
                    className="notification-view-all"
                    onClick={
                      handleViewExpenses
                    }
                  >
                    {t(
                      "viewAllExpenses"
                    )}
                  </button>
                </>
              )}

            </div>
          )}

        </div>

        {/* ===================================
            PROFILE
        ==================================== */}

        <button
          type="button"
          className="navbar-profile"
          onClick={() =>
            navigate("/profile")
          }
        >

          <div className="navbar-avatar">
            {firstLetter}
          </div>

          <div className="navbar-user-info">

            <strong>
              {userName}
            </strong>

            <span>
              {getUserLabel()}
            </span>

          </div>

        </button>

      </div>

    </header>
  );
}

export default Navbar;