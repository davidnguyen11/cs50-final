export interface TodoList {
  id: number;
  title?: string;
  user_id?: number;
  is_delete?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
