import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

/*
|--------------------------------------------------------------------------
| Public Pages
|--------------------------------------------------------------------------
*/

import LandingPage from "../pages/public/LandingPage";

/*
|--------------------------------------------------------------------------
| Auth Pages
|--------------------------------------------------------------------------
*/

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/*
|--------------------------------------------------------------------------
| Admin Pages
|--------------------------------------------------------------------------
*/

import AdminDashboard from "../pages/admin/Dashboard";

/*
|--------------------------------------------------------------------------
| User Dashboard
|--------------------------------------------------------------------------
*/

import Dashboard from "../pages/user/dashboard/Dashboard";

/*
|--------------------------------------------------------------------------
| ETF Pages
|--------------------------------------------------------------------------
*/

import EtfList from "../pages/user/etfs/EtfList";
import EtfCompare from "../pages/user/etfs/EtfCompare";
import EtfFilters from "../pages/user/etfs/EtfFilters";

/*
|--------------------------------------------------------------------------
| Portfolio Pages
|--------------------------------------------------------------------------
*/

import ListPortfolios from "../pages/user/portfolios/ListPortfolios";
import CreatePortfolio from "../pages/user/portfolios/CreatePortfolio";
import EditPortfolio from "../pages/user/portfolios/EditPortfolio";
import ViewPortfolio from "../pages/user/portfolios/ViewPortfolio";

/*
|--------------------------------------------------------------------------
| Portfolio Transaction Pages
|--------------------------------------------------------------------------
*/

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
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <UserLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
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
