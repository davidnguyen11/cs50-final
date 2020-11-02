import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { APIResponse } from '../../../types/response';
import { HttpStatusCode } from '../../../utils/status-code';
import { TodoItem } from '../../v1/models/todo-item';

export async function createTodoItem(db: DB, userId: string, todoListID: string, args: Args) {
  const response: APIResponse<TodoItem[]> = {
    status: 'fetching',
  };

  try {
    const { content } = args;
    const query: QueryConfig = {
      text: `
        INSERT INTO todo_items (content, user_id, todo_list_id)
        VALUES($1, $2, $3) RETURNING *
      `,
      values: [content, userId, todoListID],
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
  content: string;
}
