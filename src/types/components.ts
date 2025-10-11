/**
 * Component Types
 * Type definitions for React components
 */

import { ReactNode, ComponentType } from 'react';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Icon names
export type IconName = 'globe' | 'menu' | 'close' | 'chevron-down' | 'check' | 'user' | 'settings';

// Text variants
export type TextVariant = 'title' | 'heading' | 'subheading' | 'body' | 'caption';
export type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

// Layout
export interface LayoutProps {
  children: ReactNode;
}

export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
}

// Navigation
export interface NavLink {
  label: string;
  href: string;
  icon?: IconName;
  children?: NavLink[];
}

// Form
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  validation?: any;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}