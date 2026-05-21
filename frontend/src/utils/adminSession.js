export const ADMIN_SESSION_DURATION_MS = 15 * 60 * 1000;
export const ADMIN_SESSION_EXPIRY_KEY = "adminSessionExpiresAt";

export const clearAdminSessionStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem(ADMIN_SESSION_EXPIRY_KEY);
};

export const startAdminSession = () => {
  const expiresAt = Date.now() + ADMIN_SESSION_DURATION_MS;
  localStorage.setItem(ADMIN_SESSION_EXPIRY_KEY, String(expiresAt));
  return expiresAt;
};

export const getAdminSessionExpiry = () => {
  const rawValue = localStorage.getItem(ADMIN_SESSION_EXPIRY_KEY);
  if (!rawValue) {
    return null;
  }

  const expiry = Number(rawValue);
  return Number.isFinite(expiry) ? expiry : null;
};

export const isAdminSessionExpired = () => {
  const expiry = getAdminSessionExpiry();
  if (!expiry) {
    return true;
  }

  return Date.now() >= expiry;
};
