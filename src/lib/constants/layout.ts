/**
 * Layout Constants
 * Centralized values for consistent spacing and sizing across the app
 */

export const LAYOUT = {
  // Header height - should match the actual rendered header height
  HEADER_HEIGHT: 80, // px
  
  // Content padding top - adds space below fixed header
  CONTENT_PADDING_TOP: 'pt-24', // 6rem = 96px (more than header for breathing room)
  
  // Container max widths
  CONTAINER_SM: 'max-w-3xl',   // 768px
  CONTAINER_MD: 'max-w-5xl',   // 1024px
  CONTAINER_LG: 'max-w-7xl',   // 1280px
  CONTAINER_XL: 'max-w-[1400px]',
  
  // Common spacings
  SECTION_SPACING: 'py-16',
  CARD_SPACING: 'p-6',
  
  // Z-index layers
  Z_INDEX: {
    HEADER: 50,
    DROPDOWN: 40,
    MODAL: 100,
    TOAST: 9999,
  }
} as const;

export type LayoutConstants = typeof LAYOUT;
