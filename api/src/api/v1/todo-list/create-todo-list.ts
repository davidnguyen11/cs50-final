import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { APIResponse } from '../../../types/response';
import { HttpStatusCode } from '../../../utils/status-code';
import { TodoList } from '../../v1/models/todo-list';

export async function createTodoList(db: DB, userId: string, args: Args) {
  const response: APIResponse<TodoList> = {
    status: 'fetching',
  };

  try {
    const { title } = args;
    const query: QueryConfig = {
      text: `
        INSERT INTO todo_lists (title, user_id)
        VALUES($1, $2) RETURNING *
      `,
      values: [title, userId],
    };
    const data = await db.query(query);
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
