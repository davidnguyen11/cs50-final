import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { APIResponse } from '../../../types/response';
import { HttpStatusCode } from '../../../utils/status-code';
import { TodoList } from '../../v1/models/todo-list';

export async function deleteTodoList(db: DB, todoListId: string) {
  const response: APIResponse<TodoList> = {
    status: 'fetching',
  };

  try {
    const query: QueryConfig = {
      text: `
        UPDATE todo_lists
        SET is_delete = True
        WHERE id = $1 AND is_delete = False
        RETURNING *;
      `,
      values: [todoListId],
    };
    const data = await db.query(query);

    if (data.rowCount === 0) {
      throw Error('Failed deleting');
    }

    response.data = {
      id: data.rows[0].id,
    };
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
