import express, { Request, Response, NextFunction } from 'express';
import { checkToken } from './middleware/check-token';
import { db } from '../../db';
import { login } from './auth/login';
import { register } from './user/register';
import { createTodoList } from './todo-list/create-todo-list';
import { updateTitle } from './todo-list/update-title';
import { deleteTodoList } from './todo-list/delete-todo-list';
import { getTodoLists } from './todo-list/get-todo-lists';
import { get } from '../../utils/response-locals';
import { createTodoItem } from './todo-item/create-todo-item';
import { getTodoItemsByTodoListId } from './todo-item/get-todo-items-by-todo-list-id';
import { updateContentTodoItem } from './todo-item/update-content';
import { completeItem } from './todo-item/complete-item';
import { deleteItem } from './todo-item/delete-item';

const router = express.Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const response = await login(db, req.body);

  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const response = await register(db, req.body);
  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

// todo list
router.post('/todo-list', checkToken, async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = get(res, 'auth');
  const response = await createTodoList(db, userId, req.body);
  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

router.patch('/todo-list/:todoListId', checkToken, async (req: Request, res: Response, next: NextFunction) => {
  const todoListId = req.params.todoListId;
  const response = await updateTitle(db, todoListId, req.body);
  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

router.delete('/todo-list/:todoListId', checkToken, async (req: Request, res: Response, next: NextFunction) => {
  const todoListId = req.params.todoListId;
  const response = await deleteTodoList(db, todoListId);
  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

router.get('/todo-list', checkToken, async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = get(res, 'auth');
  const response = await getTodoLists(db, userId);
  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

// todo item
router.post('/:todoListId/todo-item', checkToken, async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = get(res, 'auth');
  const todoListId = req.params.todoListId;
  const response = await createTodoItem(db, userId, todoListId, req.body);
  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

router.patch('/:todoListId/todo-item', checkToken, async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = get(res, 'auth');
  const todoListId = req.params.todoListId;
  const response = await updateContentTodoItem(db, userId, todoListId, req.body);
  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

router.patch('/:todoListId/todo-item/complete', checkToken, async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = get(res, 'auth');
  const todoListId = req.params.todoListId;
  const response = await completeItem(db, userId, todoListId);
  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

router.delete('/:todoListId/todo-item', checkToken, async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = get(res, 'auth');
  const todoListId = req.params.todoListId;
  const response = await deleteItem(db, userId, todoListId);
  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

router.get('/:todoListId/todo-items', checkToken, async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = get(res, 'auth');
  const todoListId = req.params.todoListId;
  const response = await getTodoItemsByTodoListId(db, userId, todoListId);
  if (response.error) {
    res.status(response.statusCode);
  }
  res.send(response);
});

export { router };
