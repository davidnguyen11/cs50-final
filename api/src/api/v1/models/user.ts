export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
