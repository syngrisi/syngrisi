export interface User {
  changePassword: (currentPassword: string, newPassword: string) => void;
  apiKey: string;
  username: string;
  save: () => void;
  setPassword: (newPassword: string) => void;
}