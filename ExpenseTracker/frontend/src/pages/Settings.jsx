import React, { useEffect, useState } from "react";
import {
  Languages,
  IndianRupee,
  Moon,
  Bell,
  Save,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import "../assets/styles/settings.css";

function Settings() {
  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  const [currency, setCurrency] =
    useState("INR (₹)");

  const [darkMode, setDarkMode] =
    useState(false);

  const [notifications, setNotifications] =
    useState(true);

  const [message, setMessage] =
    useState("");

  /* =========================================
     LOAD SETTINGS
  ========================================= */

  useEffect(() => {
    try {
      const settings =
        JSON.parse(
          localStorage.getItem(
            "spendmate_settings"
          )
        ) || {};

      const savedDarkMode =
        settings.darkMode === true;

      setCurrency(
        settings.currency ||
          "INR (₹)"
      );

      setDarkMode(
        savedDarkMode
      );

      setNotifications(
        settings.notifications !==
          undefined
          ? settings.notifications
          : true
      );

      document.body.classList.toggle(
        "dark-mode",
        savedDarkMode
      );
    } catch {
      setCurrency("INR (₹)");
      setDarkMode(false);
      setNotifications(true);

      document.body.classList.remove(
        "dark-mode"
      );
    }
  }, []);

  /* =========================================
     KEEP DARK MODE IN SYNC
  ========================================= */

  useEffect(() => {
    const handleThemeChange = () => {
      const isDark =
        document.body.classList.contains(
          "dark-mode"
        );

      setDarkMode(isDark);
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
     LANGUAGE
  ========================================= */

  const handleLanguageChange = (
    value
  ) => {
    setLanguage(value);
  };

  /* =========================================
     DARK MODE
  ========================================= */

  const handleDarkMode = (
    value
  ) => {
    setDarkMode(value);

    document.body.classList.toggle(
      "dark-mode",
      value
    );

    /*
      Keep the rest of SpendMate
      synchronized immediately.
    */

    window.dispatchEvent(
      new Event("themeChanged")
    );
  };

  /* =========================================
     NOTIFICATIONS
  ========================================= */

  const handleNotifications = (
    value
  ) => {
    setNotifications(value);
  };

  /* =========================================
     SAVE
  ========================================= */

  const handleSave = () => {
    const settings = {
      language,
      currency,
      darkMode,
      notifications,
    };

    localStorage.setItem(
      "spendmate_settings",
      JSON.stringify(settings)
    );

    document.body.classList.toggle(
      "dark-mode",
      darkMode
    );

    window.dispatchEvent(
      new Event("themeChanged")
    );

    window.dispatchEvent(
      new Event("notificationsChanged")
    );

    setMessage(
      t("settingsSaved")
    );

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  /* =========================================
     DARK MODE DESCRIPTION
  ========================================= */

  const getDarkModeDescription = () => {
    if (language === "Telugu") {
      return "SpendMate అంతటా డార్క్ రూపాన్ని ఉపయోగించండి.";
    }

    if (language === "Hindi") {
      return "पूरे SpendMate में गहरा रूप उपयोग करें।";
    }

    return "Use a darker appearance across SpendMate.";
  };

  return (
    <div className="settings-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="settings-header">

        <div>

          <h1>
            {t("settings")}
          </h1>

          <p>
            {t(
              "customizeExperience"
            )}
          </p>

        </div>

      </div>

      {/* =====================================
          SETTINGS CONTAINER
      ====================================== */}

      <div className="settings-container">

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="settings-success">
            {message}
          </div>
        )}

        {/* ===================================
            LANGUAGE
        ==================================== */}

        <div className="settings-section">

          <div className="settings-section-icon">
            <Languages size={19} />
          </div>

          <div className="settings-section-content">

            <h2>
              {t("language")}
            </h2>

            <p>
              {t(
                "chooseLanguage"
              )}
            </p>

            <select
              value={language}
              onChange={(e) =>
                handleLanguageChange(
                  e.target.value
                )
              }
            >
              <option value="English">
                English
              </option>

              <option value="Telugu">
                తెలుగు
              </option>

              <option value="Hindi">
                हिन्दी
              </option>
            </select>

          </div>

        </div>

        {/* ===================================
            CURRENCY
        ==================================== */}

        <div className="settings-section">

          <div className="settings-section-icon">
            <IndianRupee size={19} />
          </div>

          <div className="settings-section-content">

            <h2>
              {t("currency")}
            </h2>

            <p>
              {t(
                "chooseCurrency"
              )}
            </p>

            <select
              value={currency}
              onChange={(e) =>
                setCurrency(
                  e.target.value
                )
              }
            >
              <option value="INR (₹)">
                Indian Rupee (₹)
              </option>

              <option value="USD ($)">
                US Dollar ($)
              </option>

              <option value="EUR (€)">
                Euro (€)
              </option>

              <option value="GBP (£)">
                British Pound (£)
              </option>

            </select>

          </div>

        </div>

        {/* ===================================
            DARK MODE
        ==================================== */}

        <div className="settings-section settings-toggle-section">

          <div className="settings-section-icon">
            <Moon size={19} />
          </div>

          <div className="settings-section-content">

            <h2>
              {t("darkMode")}
            </h2>

            <p>
              {getDarkModeDescription()}
            </p>

          </div>

          <button
            type="button"
            className={`settings-toggle ${
              darkMode
                ? "on"
                : ""
            }`}
            onClick={() =>
              handleDarkMode(
                !darkMode
              )
            }
            aria-label={t(
              "darkMode"
            )}
            aria-pressed={
              darkMode
            }
          >
            <span></span>
          </button>

        </div>

        {/* ===================================
            NOTIFICATIONS
        ==================================== */}

        <div className="settings-section settings-toggle-section">

          <div className="settings-section-icon">
            <Bell size={19} />
          </div>

          <div className="settings-section-content">

            <h2>
              {t("notifications")}
            </h2>

            <p>
              {t(
                "notificationsDescription"
              )}
            </p>

          </div>

          <button
            type="button"
            className={`settings-toggle ${
              notifications
                ? "on"
                : ""
            }`}
            onClick={() =>
              handleNotifications(
                !notifications
              )
            }
            aria-label={t(
              "notifications"
            )}
            aria-pressed={
              notifications
            }
          >
            <span></span>
          </button>

        </div>

        {/* ===================================
            SAVE
        ==================================== */}

        <div className="settings-actions">

          <button
            type="button"
            className="settings-save-btn"
            onClick={handleSave}
          >
            <Save size={16} />

            {t(
              "saveSettings"
            )}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;