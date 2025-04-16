
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  responseStyle: 'concise' | 'detailed';
  showTimestamps: boolean;
  enableMarkdown: boolean;
}

export const defaultPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  responseStyle: 'detailed',
  showTimestamps: true,
  enableMarkdown: true,
};
