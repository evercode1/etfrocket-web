import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

import LandingPage from "../pages/public/LandingPage";
import VerifyAccount from "../pages/public/VerifyAccount";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import AdminDashboard from "../pages/admin/Dashboard";
import ListUsers from "../pages/admin/users/ListUsers";
import ViewUser from "../pages/admin/users/ViewUser";
import EditUser from "../pages/admin/users/EditUser";

import Dashboard from "../pages/user/dashboard/Dashboard";
import Settings from "../pages/user/settings/Settings";

import EtfList from "../pages/user/etfs/EtfList";
import EtfCompare from "../pages/user/etfs/EtfCompare";
import EtfFilters from "../pages/user/etfs/EtfFilters";

import ListPortfolios from "../pages/user/portfolios/ListPortfolios";
import CreatePortfolio from "../pages/user/portfolios/CreatePortfolio";
import EditPortfolio from "../pages/user/portfolios/EditPortfolio";
import ViewPortfolio from "../pages/user/portfolios/ViewPortfolio";

import ListPortfolioTransactions from "../pages/user/portfolio-transactions/ListPortfolioTransactions";
import ImportPortfolioTransactions from "../pages/user/portfolio-transactions/ImportPortfolioTransactions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "account/verify/:token",
        element: <VerifyAccount />,
      },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "users",
            element: <ListUsers />,
          },
          {
            path: "users/:id",
            element: <ViewUser />,
          },
          {
            path: "users/:id/edit",
            element: <EditUser />,
          },
        ],
      },

      {
        path: "/dashboard",
        element: <UserLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "etfs",
            element: <EtfList />,
          },
          {
            path: "etfs/compare",
            element: <EtfCompare />,
          },
          {
            path: "etfs/filters",
            element: <EtfFilters />,
          },
          {
            path: "portfolios",
            element: <ListPortfolios />,
          },
          {
            path: "portfolios/create",
            element: <CreatePortfolio />,
          },
          {
            path: "portfolios/:id",
            element: <ViewPortfolio />,
          },
          {
            path: "portfolios/:id/edit",
            element: <EditPortfolio />,
          },
          {
            path: "portfolios/:id/transactions",
            element: <ListPortfolioTransactions />,
          },
          {
            path: "portfolios/:id/transactions/import",
            element: <ImportPortfolioTransactions />,
          },
        ],
      },
    ],
  },
]);

export default router;
