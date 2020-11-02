import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { APIResponse } from '../../../types/response';
import { HttpStatusCode } from '../../../utils/status-code';
import { TodoItem } from '../../v1/models/todo-item';

export async function getTodoItemsByTodoListId(db: DB, userId: string, todoListID: string) {
  const response: APIResponse<TodoItem> = {
    status: 'fetching',
  };

  try {
    const query: QueryConfig = {
      text: `
        SELECT i.id, content
        FROM todo_items i, todo_lists l
        WHERE i.todo_list_id = $1 AND i.user_id = $2 AND i.is_done = False AND i.is_delete = False AND
          i.todo_list_id = l.id AND l.is_delete = False
      `,
      values: [userId, todoListID],
    };
    const data = await db.query(query);
    response.data = data.rows;
    response.status = 'success';
  } catch (e) {
    response.status = 'error';
    response.statusCode = HttpStatusCode.BAD_REQUEST;
    response.error = {
      message: e.message,
    };
  }

  return response;
}
