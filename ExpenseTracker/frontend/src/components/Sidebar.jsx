import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

import {
  LayoutDashboard,
  Receipt,
  Wallet,
  BarChart3,
  Target,
  Tags,
  PiggyBank,
  User,
  Settings,
  CalendarDays,
  Moon,
  LogOut,
} from "lucide-react";

import "../assets/styles/sidebar.css";

function Sidebar() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  /* =========================================
     DARK MODE STATE
  ========================================= */

  const [isDarkMode, setIsDarkMode] =
    useState(() => {
      try {
        const settings =
          JSON.parse(
            localStorage.getItem(
              "spendmate_settings"
            )
          ) || {};

        return settings.darkMode === true;
      } catch {
        return document.body.classList.contains(
          "dark-mode"
        );
      }
    });

  /* =========================================
     KEEP SIDEBAR IN SYNC
  ========================================= */

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(
        document.body.classList.contains(
          "dark-mode"
        )
      );
    };

    window.addEventListener(
      "themeChanged",
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        "themeChanged",
        handleThemeChange
      );
    };
  }, []);

  /* =========================================
     DARK MODE TOGGLE
  ========================================= */

  const handleDarkMode = () => {
    const newMode =
      !document.body.classList.contains(
        "dark-mode"
      );

    document.body.classList.toggle(
      "dark-mode",
      newMode
    );

    setIsDarkMode(newMode);

    const settings =
      JSON.parse(
        localStorage.getItem(
          "spendmate_settings"
        )
      ) || {};

    localStorage.setItem(
      "spendmate_settings",
      JSON.stringify({
        ...settings,
        darkMode: newMode,
      })
    );

    window.dispatchEvent(
      new Event("themeChanged")
    );
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "spendmate_logged_in"
    );

    localStorage.removeItem(
      "spendmate_expenses_search"
    );

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">

      {/* =====================================
          LOGO
      ====================================== */}

      <div className="sidebar-logo">

        <div className="logo-icon">
          ₹
        </div>

        <div className="logo-text">
          <strong className="brand-name">
            {t("brandName")}
          </strong>
        </div>

      </div>


      {/* =====================================
          NAVIGATION
      ====================================== */}

      <nav className="sidebar-nav">

        <p className="nav-section-title">
          {t("mainMenu")}
        </p>


        {/* DASHBOARD */}

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <LayoutDashboard size={18} />

          <span>
            {t("dashboard")}
          </span>
        </NavLink>


        {/* EXPENSES */}

        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <Receipt size={18} />

          <span>
            {t("expenses")}
          </span>
        </NavLink>


        {/* SPENDING CALENDAR */}

        <NavLink
          to="/spending-calendar"
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <CalendarDays size={18} />

          <span>
            Spending Calendar
          </span>
        </NavLink>


        {/* INCOME */}

        <NavLink
          to="/income"
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <Wallet size={18} />

          <span>
            {t("income")}
          </span>
        </NavLink>


        {/* REPORTS */}

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <BarChart3 size={18} />

          <span>
            {t("reports")}
          </span>
        </NavLink>


        {/* BUDGETS */}

        <NavLink
          to="/budgets"
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <Target size={18} />

          <span>
            {t("budgets")}
          </span>
        </NavLink>


        {/* SAVINGS GOALS */}

        <NavLink
          to="/savings-goals"
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <PiggyBank size={18} />

          <span>
            {t("savingsGoals")}
          </span>
        </NavLink>


        {/* CATEGORIES */}

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <Tags size={18} />

          <span>
            {t("categories")}
          </span>
        </NavLink>


        {/* DIVIDER */}

        <div className="sidebar-divider"></div>


        {/* ===================================
            ACCOUNT
        ==================================== */}

        <p className="nav-section-title">
          {t("account")}
        </p>


        {/* PROFILE */}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <User size={18} />

          <span>
            {t("profile")}
          </span>
        </NavLink>


        {/* SETTINGS */}

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <Settings size={18} />

          <span>
            {t("settings")}
          </span>
        </NavLink>

      </nav>


      {/* =====================================
          BOTTOM
      ====================================== */}

      <div className="sidebar-bottom">

        {/* DARK MODE */}

        <div className="dark-mode-row">

          <div className="dark-mode-label">

            <Moon size={17} />

            <span>
              {t("darkMode")}
            </span>

          </div>

          <button
            type="button"
            className={`toggle-switch ${
              isDarkMode ? "on" : ""
            }`}
            onClick={handleDarkMode}
            aria-label={t("darkMode")}
            aria-pressed={isDarkMode}
          >
            <span></span>
          </button>

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={17} />

          <span>
            {t("logout")}
          </span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;