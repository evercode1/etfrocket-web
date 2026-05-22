export const SELECTED_PORTFOLIO_STORAGE_KEY = "selectedPortfolioId";

export function getStoredPortfolioId() {
  return localStorage.getItem(SELECTED_PORTFOLIO_STORAGE_KEY);
}

export function setStoredPortfolioId(portfolioId) {
  if (!portfolioId) {
    return;
  }

  localStorage.setItem(SELECTED_PORTFOLIO_STORAGE_KEY, String(portfolioId));
}
