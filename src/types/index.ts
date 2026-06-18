export * from "./database";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface ActionResult<T = void> {
  data?: T;
  error?: string;
}
