import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { APIResponse } from '../../../types/response';
import { HttpStatusCode } from '../../../utils/status-code';
import { TodoList } from '../../v1/models/todo-list';

export async function getTodoLists(db: DB, userId: string) {
  const response: APIResponse<TodoList[]> = {
    status: 'fetching',
  };

  try {
    const query: QueryConfig = {
      text: `
        SELECT id, title
        FROM todo_lists
        WHERE user_id = $1 AND is_delete = False
      `,
      values: [userId],
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
