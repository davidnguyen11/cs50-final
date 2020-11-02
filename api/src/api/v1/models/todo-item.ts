export interface TodoItem {
  id: number;
  content: string;
  user_id: number;
  todo_list_id: number;
  is_done: boolean;
  is_delete: boolean;
  created_at: Date;
  updated_at: Date;
}
