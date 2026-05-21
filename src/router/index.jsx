import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

import LandingPage from "../pages/public/LandingPage";
import VerifyAccount from "../pages/public/VerifyAccount";
import HelpCenter from "../pages/public/help/HelpCenter";
import HelpArticle from "../pages/public/help/HelpArticle";
import PrivacyPolicy from "../pages/public/legal/PrivacyPolicy";
import TermsOfService from "../pages/public/legal/TermsOfService";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import AdminDashboard from "../pages/admin/Dashboard";
import ListUsers from "../pages/admin/users/ListUsers";
import ViewUser from "../pages/admin/users/ViewUser";
import EditUser from "../pages/admin/users/EditUser";
import ListTickets from "../pages/admin/support/ListTickets";
import ViewTicket from "../pages/admin/support/ViewTicket";
import DataManagement from "../pages/admin/data/DataManagement";

import Dashboard from "../pages/user/dashboard/Dashboard";
import Settings from "../pages/user/settings/Settings";
import ListMyTickets from "../pages/user/support/ListMyTickets";
import CreateTicket from "../pages/user/support/CreateTicket";
import ViewMyTicket from "../pages/user/support/ViewMyTicket";
import Portfolios from "../pages/user/dashboard/portfolios/Portfolios";
import CreatePortfolio from "../pages/user/dashboard/portfolios/CreatePortfolio";
import PortfolioDetail from "../pages/user/dashboard/portfolios/PortfolioDetail";
import UpdatePortfolio from "../pages/user/dashboard/portfolios/UpdatePortfolio";
import AddPortfolioTransaction from "../pages/user/dashboard/transactions/AddPortfolioTransaction";
import PortfolioTransactions from "../pages/user/dashboard/transactions/PortfolioTransactions";
import UpdateTransaction from "../pages/user/dashboard/transactions/UpdateTransaction";
import IncomeProjection from "../pages/user/dashboard/incomeProjection/IncomeProjection";
import Dividends from "../pages/user/dashboard/dividends/Dividends";
import DividendCalendar from "../pages/user/dashboard/dividends/DividendCalendar";
import DividendHistory from "../pages/user/dashboard/dividends/DividendHistory";
import PortfolioCompare from "../pages/user/dashboard/radar/PortfolioCompare";
import SymbolCompare from "../pages/user/dashboard/radar/SymbolCompare";
import MetricExplorer from "../pages/user/dashboard/radar/MetricExplorer";

import EtfList from "../pages/user/etfs/EtfList";
import EtfCompare from "../pages/user/etfs/EtfCompare";
import EtfFilters from "../pages/user/etfs/EtfFilters";

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
      {
        path: "help",
        element: <HelpCenter />,
      },
      {
        path: "help/:slug",
        element: <HelpArticle />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-of-service",
        element: <TermsOfService />,
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
          {
            path: "support",
            element: <ListTickets />,
          },
          {
            path: "support/:id",
            element: <ViewTicket />,
          },
          {
            path: "data",
            element: <DataManagement />,
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
            element: <Portfolios />,
          },
          {
            path: "portfolios/create",
            element: <CreatePortfolio />,
          },

          {
            path: "portfolios/:id",
            element: <PortfolioDetail />,
          },
          {
            path: "portfolios/:id/edit",
            element: <UpdatePortfolio />,
          },
          {
            path: "portfolios/:id/transactions/create",
            element: <AddPortfolioTransaction />,
          },
          {
            path: "portfolios/:id/transactions",
            element: <PortfolioTransactions />,
          },
          {
            path: "portfolios/:id/transactions/:transactionId/edit",
            element: <UpdateTransaction />,
          },
          {
            path: "dividends/:portfolioId",
            element: <Dividends />,
          },
          {
            path: "income-projection/:portfolioId",

            element: <IncomeProjection />,
          },
          {
            path: "dividends/:portfolioId/calendar",

            element: <DividendCalendar />,
          },
          {
            path: "dividends/:portfolioId/history",

            element: <DividendHistory />,
          },
          {
            path: "radar/portfolio-compare/:portfolioId",

            element: <PortfolioCompare />,
          },
          {
            path: "radar/symbol-compare",

            element: <SymbolCompare />,
          },
          {
            path: "radar/metric-explorer",

            element: <MetricExplorer />,
          },
          {
            path: "support",
            element: <ListMyTickets />,
          },
          {
            path: "support/create",
            element: <CreateTicket />,
          },
          {
            path: "support/:id",
            element: <ViewMyTicket />,
          },
        ],
      },
    ],
  },
]);

export default router;
