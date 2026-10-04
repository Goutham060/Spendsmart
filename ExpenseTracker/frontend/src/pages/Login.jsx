import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

import "../assets/styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     LOGIN
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const trimmedEmail =
      email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
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
         LOGIN FAILED
      ==================================== */

      if (!response.ok) {
        setError(
          data?.message ||
            "Incorrect email or password."
        );

        return;
      }

      /* ===================================
         LOGIN SUCCESS
      ==================================== */

      const loggedInUser = {
        id: data.id,
        name: data.name,
        email: data.email,
      };

      /*
        Store only safe user information.
        Password is NOT stored in localStorage.
      */

      localStorage.setItem(
        "spendmate_user",
        JSON.stringify(
          loggedInUser
        )
      );

      localStorage.setItem(
        "spendmate_logged_in",
        "true"
      );

      /*
        Clear any old Navbar search
        from a previous session.
      */

      localStorage.removeItem(
        "spendmate_expenses_search"
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Login request failed:",
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
            {t("welcomeBack")}
          </h1>

          <p>
            {t("signInContinue")}
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
                placeholder="Enter your password"
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
              SUBMIT
          ================================= */}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : t("signIn")}
          </button>

        </form>

        {/* ===================================
            REGISTER LINK
        ==================================== */}

        <p className="auth-switch">

          {t("noAccount")}{" "}

          <Link to="/register">
            {t("register")}
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;