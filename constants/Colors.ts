// constants/Colors.ts
export const Colors = {
  primary: '#00BCD4',
  secondary: '#E0F7FA',
  text: {
    primary: '#000000',
    secondary: '#666666',
    light: '#999999',
  },
  background: {
    main: '#F8F9FA',
    white: '#FFFFFF',
    gray: '#E0E0E0',
  },
  accent: {
    yellow: '#FFC107',
    cyan: '#00BCD4',
  },
  border: '#F0F0F0',
};

// constants/theme.ts
export const theme = {
  colors: Colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 15,
    lg: 18,
    xl: 22,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export default theme;