// API Types based on swagger.json

export interface User {
  user_id: number;
  login: string;
  password?: string;
  full_name?: string;
  balance?: number;
  phone?: string;
  discount?: number;
  created?: string;
  last_login?: string;
  settings?: Record<string, unknown>;
}

export interface Service {
  user_service_id: number;
  service_id: number;
  name: string;
  status: number;
  created?: string;
  expire?: string;
  next?: string;
  cost?: number;
  discount?: number;
  qnt?: number;
  settings?: Record<string, unknown>;
}

export interface ServiceOrder {
  service_id: number;
  name: string;
  cost: number;
  period_cost?: number;
  category?: string;
  description?: string;
  config?: Record<string, unknown>;
}

export interface PaySystem {
  id: number;
  name: string;
  category?: string;
}

export interface AuthResponse {
  id: string;  // session_id from API
}

export interface ApiError {
  error: string;
  code?: number;
}

// Telegram WebApp types
export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// App state types
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  sessionId: string | null;
  isTelegram: boolean;
  error: string | null;
}

export type TabType = 'tariffs' | 'subscriptions' | 'profile';
