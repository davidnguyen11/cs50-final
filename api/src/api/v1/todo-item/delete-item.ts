import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { APIResponse } from '../../../types/response';
import { HttpStatusCode } from '../../../utils/status-code';
import { TodoItem } from '../../v1/models/todo-item';

export async function deleteItem(db: DB, userId: string, todoListId: string, itemId: string) {
  const response: APIResponse<TodoItem> = {
    status: 'fetching',
  };

  try {
    const query: QueryConfig = {
      text: `
        UPDATE todo_items i
        SET is_delete = True, updated_at = NOW()
        FROM todo_lists l
        WHERE i.id = $1 AND i.is_done = False AND i.is_delete = False AND
          l.user_id = $2 AND i.todo_list_id = l.id AND l.is_delete = False AND
          l.id = $3
        RETURNING i.id;
      `,
      values: [itemId, userId, todoListId],
    };
    const data = await db.query(query);

    if (data.rowCount === 0) {
      throw Error('Failed updating');
    }

    response.data = data.rows[0];
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
