// UI-related types

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
