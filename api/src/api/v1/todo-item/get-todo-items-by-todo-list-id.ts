import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { APIResponse } from '../../../types/response';
import { HttpStatusCode } from '../../../utils/status-code';
import { ItemsOfList } from '../../v1/models/todo-item';
import { TodoList } from '../models/todo-list';

export async function getTodoItemsByTodoListId(db: DB, userId: string, todoListID: string) {
  const response: APIResponse<ItemsOfList> = {
    status: 'fetching',
  };

  try {
    let listQuery: QueryConfig = {
      text: `
        SELECT l.title, l.id AS list_id
        FROM todo_lists l
        WHERE l.user_id = $1 AND l.id = $2 AND l.is_delete = False
      `,
      values: [userId, todoListID],
    }

    const query: QueryConfig = {
      text: `
        SELECT i.id, i.is_done, content
        FROM todo_items i, todo_lists l
        WHERE i.user_id = $1 AND i.todo_list_id = $2 AND i.is_delete = False AND
          i.todo_list_id = l.id AND l.is_delete = False
        ORDER BY i.id DESC
      `,
      values: [userId, todoListID],
    };
    const data: ItemsOfList = {};

    const rawListData = await db.query(listQuery);
    if (rawListData.rows.length > 0) {
      data.list = rawListData.rows[0];
    }

    const itemsData = await db.query(query);

    if (itemsData.rows.length > 0) {
      data.items = itemsData.rows;
    }

    response.data = data;
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
