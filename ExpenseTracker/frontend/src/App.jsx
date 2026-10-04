import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Income from "./pages/Income";
import Reports from "./pages/Reports";
import Budgets from "./pages/Budgets";
import SavingsGoals from "./pages/SavingsGoals";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SpendingCalendar from "./pages/SpendingCalendar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import "./App.css";

/* =========================================
   MAIN LAYOUT
========================================= */

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

/* =========================================
   PROTECTED ROUTE
========================================= */

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem(
      "spendmate_logged_in"
    ) === "true";

  return isLoggedIn ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
}

/* =========================================
   AUTH ROUTE
========================================= */

function AuthRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem(
      "spendmate_logged_in"
    ) === "true";

  return isLoggedIn ? (
    <Navigate
      to="/dashboard"
      replace
    />
  ) : (
    children
  );
}

/* =========================================
   APP
========================================= */

function App() {
  /* =======================================
     LOAD DARK MODE FROM LOCAL STORAGE
  ======================================= */

  useEffect(() => {
    try {
      const settings =
        JSON.parse(
          localStorage.getItem(
            "spendmate_settings"
          )
        ) || {};

      document.body.classList.toggle(
        "dark-mode",
        settings.darkMode === true
      );
    } catch {
      document.body.classList.remove(
        "dark-mode"
      );
    }
  }, []);

  return (
    <Routes>

      {/* =====================================
          DEFAULT
      ====================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* =====================================
          AUTHENTICATION
      ====================================== */}

      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />

      <Route
        path="/register"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />


      {/* =====================================
          DASHBOARD
      ====================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =====================================
          EXPENSES
      ====================================== */}

      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <Layout>
              <Expenses />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/expenses/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddExpense />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/expenses/edit/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <EditExpense />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =====================================
          SPENDING CALENDAR
      ====================================== */}

      <Route
        path="/spending-calendar"
        element={
          <ProtectedRoute>
            <Layout>
              <SpendingCalendar />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =====================================
          INCOME
      ====================================== */}

      <Route
        path="/income"
        element={
          <ProtectedRoute>
            <Layout>
              <Income />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =====================================
          REPORTS
      ====================================== */}

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =====================================
          BUDGETS
      ====================================== */}

      <Route
        path="/budgets"
        element={
          <ProtectedRoute>
            <Layout>
              <Budgets />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =====================================
          SAVINGS GOALS
      ====================================== */}

      <Route
        path="/savings-goals"
        element={
          <ProtectedRoute>
            <Layout>
              <SavingsGoals />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =====================================
          CATEGORIES
      ====================================== */}

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Layout>
              <Categories />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =====================================
          PROFILE
      ====================================== */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =====================================
          SETTINGS
      ====================================== */}

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =====================================
          404
      ====================================== */}

      <Route
        path="/404"
        element={<NotFound />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/404"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;