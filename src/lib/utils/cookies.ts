import Cookies from 'js-cookie';

// Cookie configuration
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production', // Only secure in production
  sameSite: 'strict' as const,
  expires: 7, // 7 days
  path: '/',
};

const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

/**
 * Set authentication token in cookie
 */
export const setAuthToken = (token: string, expiryTimestamp?: number): void => {
  console.log('🍪 Setting authToken in cookie...');
  
  const options: Cookies.CookieAttributes = { ...COOKIE_OPTIONS };
  
  // If token has expiry, use it for cookie expiry
  if (expiryTimestamp) {
    const expiryDate = new Date(expiryTimestamp);
    options.expires = expiryDate;
  }
  
  Cookies.set(AUTH_TOKEN_KEY, token, options);
  console.log('✅ AuthToken saved to cookie');
};

/**
 * Get authentication token from cookie
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

/**
 * Set refresh token in cookie
 */
export const setRefreshToken = (token: string): void => {
  console.log('🍪 Setting refreshToken in cookie...');
  Cookies.set(REFRESH_TOKEN_KEY, token, COOKIE_OPTIONS);
  console.log('✅ RefreshToken saved to cookie');
};

/**
 * Get refresh token from cookie
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

/**
 * Set token expiry timestamp in cookie
 */
export const setTokenExpiry = (expiryTimestamp: number): void => {
  Cookies.set(TOKEN_EXPIRY_KEY, expiryTimestamp.toString(), COOKIE_OPTIONS);
};

/**
 * Get token expiry timestamp from cookie
 */
export const getTokenExpiry = (): number | undefined => {
  const expiry = Cookies.get(TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : undefined;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  
  // Add 1 minute buffer for expiry check
  const bufferTime = 60 * 1000; // 1 minute in milliseconds
  return Date.now() >= (expiry - bufferTime);
};

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = (): void => {
  console.log('🗑️ Clearing all auth cookies...');
  Cookies.remove(AUTH_TOKEN_KEY, { path: '/' });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
  Cookies.remove(TOKEN_EXPIRY_KEY, { path: '/' });
  console.log('✅ All auth cookies cleared');
};

/**
 * Check if user is authenticated based on cookies
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!(token && !isTokenExpired());
};

/**
 * Get all auth data from cookies
 */
export const getAuthDataFromCookies = () => {
  return {
    authToken: getAuthToken(),
    refreshToken: getRefreshToken(),
    tokenExpiry: getTokenExpiry(),
    isAuthenticated: isAuthenticated(),
  };
};