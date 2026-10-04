export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://spendsmart-backend-s5h6.onrender.com'
    : 'http://localhost:8080');

