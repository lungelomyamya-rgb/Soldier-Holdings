/**
 * React and DOM Types
 * 
 * React component types, DOM element types, and event handlers
 */

import React, { ReactNode } from 'react';
import { SidebarProps, PulseCardProps, TransactionItemProps, OverviewPageProps, FiatPageProps, CryptoPageProps } from './components';

// Component types
export interface ComponentType {
  App: React.ComponentType;
  Sidebar: React.ComponentType<SidebarProps>;
  PulseCard: React.ComponentType<PulseCardProps>;
  StatsGrid: React.ComponentType;
  TransactionItem: React.ComponentType<TransactionItemProps>;
  TransactionFeed: React.ComponentType<unknown>; // Will be updated with proper props
  OverviewPage: React.ComponentType<OverviewPageProps>;
  FiatPage: React.ComponentType<FiatPageProps>;
  CryptoPage: React.ComponentType<CryptoPageProps>;
  CompliancePage: React.ComponentType;
  AnalyticsPage: React.ComponentType;
  SettingsPage: React.ComponentType;
}

// Global declarations for Window interface
declare global {
  interface Window {
    // Component types with proper typing
    App: React.ComponentType;
    Sidebar: React.ComponentType<SidebarProps>;
    PulseCard: React.ComponentType<PulseCardProps>;
    StatsGrid: React.ComponentType;
    TransactionItem: React.ComponentType<TransactionItemProps>;
    TransactionFeed: React.ComponentType<unknown>; // Will be updated
    OverviewPage: React.ComponentType<OverviewPageProps>;
    FiatPage: React.ComponentType<FiatPageProps>;
    CryptoPage: React.ComponentType<CryptoPageProps>;
    CompliancePage: React.ComponentType;
    AnalyticsPage: React.ComponentType;
    SettingsPage: React.ComponentType;
  }
}

// React types (replacing any in global declarations)
export interface ReactTypes {
  useEffect: (effect: () => void | (() => void), deps?: React.DependencyList) => void;
  useMemo: <T>(factory: () => T, deps?: React.DependencyList) => T;
  createElement: <P = {}>(
    type: React.ElementType<P>,
    props?: P,
    ...children: ReactNode[]
  ) => React.ReactElement<P>;
}

// DOM Element types
export interface DOMElements {
  div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
  span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
  i: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
  h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
  h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
  header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
  main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
  li: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement>;
  form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
  input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
}

// Event Handler types
export interface EventHandlers {
  onClick: (event: React.MouseEvent) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  onFocus: (event: React.FocusEvent) => void;
  onBlur: (event: React.FocusEvent) => void;
}

// Ref types
export type Ref<T> = React.RefCallback<T> | React.RefObject<T> | null;

// Forward ref types
export type ForwardRefComponent<T, P = {}> = React.ForwardRefExoticComponent<
  P & React.RefAttributes<T>
>;

// Context types
export interface ContextType<T> {
  Provider: React.Provider<T>;
  Consumer: React.Consumer<T>;
}

// Hook types
export type HookResult<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type EffectCallback = () => void | (() => void);
export type DependencyList = ReadonlyArray<unknown>;

// Memo types
export type MemoComponentType<P = {}> = React.NamedExoticComponent<P>;

// Lazy types
export type LazyComponentType<T extends React.ComponentType<any> = React.ComponentType<any>> = React.LazyExoticComponent<T>;

// Suspense types
export interface SuspenseProps {
  children: ReactNode;
  fallback: ReactNode;
}

// Portal types
export interface PortalProps {
  children: ReactNode;
  container?: Element | DocumentFragment | null;
}

// Error boundary types
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Profiler types
export interface ProfilerProps {
  id: string;
  children: ReactNode;
  onRender?: (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => void;
}

// Strict mode types
export interface StrictModeProps {
  children: ReactNode;
}

// Fragment types
export interface FragmentProps {
  children: ReactNode;
}
