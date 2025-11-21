// utils/avatarHelper.ts
/**
 * Get avatar image source based on user data
 * Uses the user's image from API, falls back to default profile.jpg
 */
export const getAvatarSource = (user: any) => {
  // If user has an image from API, use it
  if (user?.image) {
    return { uri: user.image };
  }

  // Otherwise, use the default profile picture
  return require('../assets/images/profile.jpg');
};

/**
 * Get initials from user name for avatar placeholder
 */
export const getUserInitials = (user: any): string => {
  if (!user) return '?';
  
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};