import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { APIResponse } from '../../../types/response';
import { HttpStatusCode } from '../../../utils/status-code';
import { TodoList } from '../../v1/models/todo-list';

export async function updateTitle(db: DB, todoListId: string, args: Args) {
  const response: APIResponse<TodoList> = {
    status: 'fetching',
  };

  try {
    const { title } = args;
    const query: QueryConfig = {
      text: `
        UPDATE todo_lists
        SET title = $1
        WHERE id = $2 RETURNING *;
      `,
      values: [title, todoListId],
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
  title: string;
}
