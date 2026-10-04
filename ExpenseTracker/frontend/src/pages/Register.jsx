import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import { API_BASE_URL } from "../services/api";

import "../assets/styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================================
     REGISTER
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedEmail =
      email.trim().toLowerCase();

    /* =====================================
       CLIENT-SIDE VALIDATION
    ====================================== */

    if (trimmedName.length < 2) {
      setError(
        "Name must be at least 2 characters."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    /* =====================================
       START REQUEST
    ====================================== */

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            password,
          }),
        }
      );

      /* ===================================
         READ RESPONSE
      ==================================== */

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      /* ===================================
         ERROR
      ==================================== */

      if (!response.ok) {
        let errorMessage =
          "Registration failed. Please try again.";

        if (data?.message) {
          errorMessage = data.message;
        }

        /*
          Spring validation errors may contain
          detailed validation information.
        */

        if (
          data?.errors &&
          Array.isArray(data.errors) &&
          data.errors.length > 0
        ) {
          errorMessage =
            data.errors
              .map(
                (item) =>
                  item.defaultMessage ||
                  item.message
              )
              .filter(Boolean)
              .join(", ");
        }

        setError(errorMessage);
        return;
      }

      /* ===================================
         SUCCESS
      ==================================== */

      const registeredUser = {
        id: data.id,
        name: data.name,
        email: data.email,
      };

      /*
        Store only safe user information.
        DO NOT store the password.
      */

      localStorage.setItem(
        "spendmate_user",
        JSON.stringify(
          registeredUser
        )
      );

      localStorage.setItem(
        "spendmate_logged_in",
        "true"
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Registration request failed:",
        error
      );

      setError(
        "Unable to connect to the server. Make sure the Spring Boot backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* =====================================
          LANGUAGE SELECTION
      ====================================== */}

      <LanguageSelector />

      <div className="auth-card">

        {/* ===================================
            BRAND
        ==================================== */}

        <div className="auth-brand">

          <div className="auth-logo">
            <Wallet size={22} />
          </div>

          <div className="auth-brand-name">
            {t("brandName")}
          </div>

        </div>

        {/* ===================================
            HEADING
        ==================================== */}

        <div className="auth-heading">

          <h1>
            {t("createAccount")}
          </h1>

          <p>
            {t("startManaging")}
          </p>

        </div>

        {/* ===================================
            ERROR
        ==================================== */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* ===================================
            FORM
        ==================================== */}

        <form
          onSubmit={handleSubmit}
        >

          {/* =================================
              NAME
          ================================= */}

          <div className="auth-form-group">

            <label>
              {t("fullName")}
            </label>

            <div className="auth-input-wrapper">

              <User size={17} />

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                required
                disabled={loading}
              />

            </div>

          </div>

          {/* =================================
              EMAIL
          ================================= */}

          <div className="auth-form-group">

            <label>
              {t("emailAddress")}
            </label>

            <div className="auth-input-wrapper">

              <Mail size={17} />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
                disabled={loading}
              />

            </div>

          </div>

          {/* =================================
              PASSWORD
          ================================= */}

          <div className="auth-form-group">

            <label>
              {t("password")}
            </label>

            <div className="auth-input-wrapper">

              <Lock size={17} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>

            </div>

          </div>

          {/* =================================
              CONFIRM PASSWORD
          ================================= */}

          <div className="auth-form-group">

            <label>
              {t("confirmPassword")}
            </label>

            <div className="auth-input-wrapper">

              <Lock size={17} />

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirm(
                    !showConfirm
                  )
                }
                disabled={loading}
                aria-label={
                  showConfirm
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirm ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>

            </div>

          </div>

          {/* =================================
              SUBMIT
          ================================= */}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : t("createAccountBtn")}
          </button>

        </form>

        {/* ===================================
            LOGIN LINK
        ==================================== */}

        <p className="auth-switch">

          {t("alreadyAccount")}{" "}

          <Link to="/login">
            {t("login")}
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;