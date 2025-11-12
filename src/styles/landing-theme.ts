/**
 * Landing Page Design Tokens
 * Extracted from temp.jsx landing page design
 */

export const landingColors = {
  // Primary colors
  primary: {
    navy: '#1D3557',      // Main text, headings
    red: '#E63946',        // CTAs, accents, price
    lightGray: '#F8F9FA',  // Section backgrounds
    mint: '#F1FAEE',       // Step circles background
  },
  
  // Text colors
  text: {
    dark: '#333333',       // Body text
    light: '#6D6A6F',      // Navigation text
    muted: '#B5B3B3',      // Secondary text
  },
  
  // UI colors
  ui: {
    black: '#181819',      // Buttons, footer elements
    white: '#FFFFFF',      // Card backgrounds
    yellow: '#FFC107',     // Star ratings
    lightGray: '#E6E6E6',  // Quote marks
  },
} as const;

export const landingTypography = {
  fontFamilies: {
    primary: 'var(--font-geist-sans), sans-serif',
    secondary: 'var(--font-poppins), sans-serif',
    tertiary: 'var(--font-poppins), sans-serif',
    quaternary: 'var(--font-geist-sans), sans-serif',
  },
  
  fontSizes: {
    // Hero section
    heroTitle: '40px',
    heroSubtitle: '17.88px',
    
    // Section headings
    sectionTitle: '31.88px',
    
    // Cards and content
    cardTitle: '18.68px',
    cardText: '13.98px',
    bodyText: '15.73px',
    
    // Navigation
    navItem: '16px',
    
    // Prices
    price: '20px',
    
    // Buttons
    button: '16.37px',
    buttonLarge: '20px',
    
    // Footer
    footerHeading: '20px',
    footerText: '13.77px',
  },
  
  lineHeights: {
    tight: '22px',
    normal: '25px',
    relaxed: '28px',
    loose: '32px',
    hero: '76px',
    sectionTitle: '51px',
    cardTitle: '29px',
  },
  
  fontWeights: {
    regular: 400,
    semibold: 600,
    bold: 700,
  },
} as const;

export const landingSpacing = {
  // Container
  containerMaxWidth: '1487px',
  containerPadding: '100px',
  
  // Section spacing
  sectionGap: '60px',
  sectionPaddingY: '80px',
  
  // Component spacing
  cardGap: '30px',
  cardPadding: '20px',
  
  // Header/Footer
  headerHeight: '100px',
  footerPaddingY: '80px',
  
  // Grid gaps
  gridGap: {
    small: '10px',
    medium: '20px',
    large: '30px',
  },
} as const;

export const landingShadows = {
  card: '0px 3px 10px rgba(0, 0, 0, 0.10)',
  cardLarge: '0px 3px 15px rgba(0, 0, 0, 0.10)',
  logo: '0px 4px 4px rgba(0, 0, 0, 0.25)',
} as const;

export const landingBorderRadius = {
  small: '5px',
  medium: '8px',
  large: '10px',
  circle: '50px',
} as const;

export const landingSizes = {
  // Header
  logoWidth: '60px',
  logoHeight: '42px',
  
  // Hero
  heroHeight: '500px',
  
  // Cards
  categoryCard: {
    width: '212px',
    height: '241px',
    imageHeight: '150px',
  },
  
  equipmentCard: {
    width: '360px',
    height: '414px',
    imageHeight: '200px',
  },
  
  testimonialCard: {
    width: '360px',
    height: '230px',
  },
  
  processStep: {
    width: '265px',
    height: '257px',
    iconSize: '80px',
  },
  
  // Avatar
  avatarSize: '50px',
  
  // Buttons
  buttonHeight: {
    small: '40px',
    medium: '42px',
    large: '50px',
  },
} as const;

export const landingAnimations = {
  transition: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  
  hover: {
    scale: 1.05,
    opacity: 0.9,
  },
} as const;

// Layout breakpoints (for future responsive design)
export const landingBreakpoints = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1487px',
} as const;

// Export all as a single theme object
export const landingTheme = {
  colors: landingColors,
  typography: landingTypography,
  spacing: landingSpacing,
  shadows: landingShadows,
  borderRadius: landingBorderRadius,
  sizes: landingSizes,
  animations: landingAnimations,
  breakpoints: landingBreakpoints,
} as const;

export type LandingTheme = typeof landingTheme;
