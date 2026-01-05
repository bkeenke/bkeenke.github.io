// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/shm/v1';

// Default timeout for API requests
export const API_TIMEOUT = 30000;

export const PROFILE = process.env.NEXT_PUBLIC_BOT_PROFILE || 'telegram_bot';

export const PAYMENT_LINK_OUT = process.env.NEXT_PUBLIC_PAYMENT_LINK_OUT || 'false';

export const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_URL || '';

// Session cookie name
export const SESSION_COOKIE_NAME = 'session_id';
