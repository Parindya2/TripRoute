// theme/colors.ts
export const LIGHT_COLORS = {
  background: '#FFF',
  surface: '#FFF',
  primary: '#00BCD4',
  text: '#000',
  textSecondary: '#666',
  textTertiary: '#999',
  border: '#F5F5F5',
  borderSecondary: '#F0F0F0',
  accent: '#FF6B6B',
  gold: '#FFC107',
  shadow: '#000',
};

export const DARK_COLORS = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#00BCD4',
  text: '#FFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  border: '#2C2C2C',
  borderSecondary: '#383838',
  accent: '#FF6B6B',
  gold: '#FFC107',
  shadow: '#FFF',
};

export const getThemeColors = (isDarkMode: boolean) => {
  return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
};