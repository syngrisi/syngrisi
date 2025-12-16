import { Schema } from "mongoose";

export interface RequestUser {
  _id: Schema.Types.ObjectId
  changePassword: (currentPassword: string, newPassword: string) => void;
  apiKey: string;
  username: string;
  role?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  save: () => void;
  setPassword: (newPassword: string) => void;
}