/**
 * UI and Display Types
 * 
 * Types for UI elements, stats, and display components
 */

// Change and statistics types
export interface Change {
  type: 'increase' | 'decrease' | 'neutral';
  text: string;
  value?: number;
  percentage?: number;
}

export interface Stat {
  label: string;
  value: string;
  change?: Change;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  badge?: string;
  disabled?: boolean;
}

// UI State types
export interface UIState {
  theme: 'light' | 'dark' | 'auto';
  animations: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  sidebarCollapsed: boolean;
  notifications: boolean;
}

// Form types
export interface FormField {
  name: string;
  value: string | number | boolean;
  error?: string;
  touched?: boolean;
}

export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isSubmitting: boolean;
  errors: string[];
}

// Theme and styling types
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

// Layout types
export interface LayoutProps {
  header?: boolean;
  sidebar?: boolean;
  footer?: boolean;
  padding?: number | string;
  maxWidth?: number | string;
}

// Responsive types
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}
