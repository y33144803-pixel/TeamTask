export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}