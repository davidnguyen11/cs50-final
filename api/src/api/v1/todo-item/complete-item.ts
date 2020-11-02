import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { APIResponse } from '../../../types/response';
import { HttpStatusCode } from '../../../utils/status-code';
import { TodoItem } from '../../v1/models/todo-item';

export async function completeItem(db: DB, userId: string, todoListId: string, itemId: string, args: Args) {
  const response: APIResponse<TodoItem> = {
    status: 'fetching',
  };

  try {
    const { status } = args;
    const done = status === 'done' ? 'True' : 'False';

    const query: QueryConfig = {
      text: `
        UPDATE todo_items i
        SET is_done = $1, updated_at = NOW()
        FROM todo_lists l
        WHERE i.id = $2 AND i.is_delete = False AND
          l.user_id = $3 AND l.id = $4 AND i.todo_list_id = l.id AND l.is_delete = False
        RETURNING i.id, i.is_done;
      `,
      values: [done, itemId, userId, todoListId],
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

interface Args {
  status: 'done' | 'not-done';
}
