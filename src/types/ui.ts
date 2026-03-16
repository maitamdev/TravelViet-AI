// UI component types and common prop interfaces
import type { LucideIcon } from 'lucide-react';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface SelectOption {
  value: string;
  label: string;
  icon?: string | LucideIcon;
  disabled?: boolean;
}

export interface MenuItem {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  separator?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

export interface TabItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ColorVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
