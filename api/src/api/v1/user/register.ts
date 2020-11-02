import * as bcrypt from 'bcrypt';
import { APIResponse } from '../../../types/response';
import { Auth } from '../models/auth';
import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { isEmailValid } from '../../../utils/email-validator';
import { HttpStatusCode } from '../../../utils/status-code';

const SALT_ROUNDS = 10;
const PASSWORD_MIN_LENGTH = 7;

export async function register(db: DB, args: Args) {
  const { firstName, lastName, username, password, email } = args;
  const response: APIResponse<Auth> = {
    status: 'fetching',
  };

  try {
    if (!firstName) throw Error('First name is empty');
    if (!lastName) throw Error('Last name is empty');
    if (!username) throw Error('Username is empty');
    if (!password) throw Error('Password is empty');
    if (!isEmailValid(email)) throw Error('Email is invalid');
    if (password.length < PASSWORD_MIN_LENGTH) throw Error('Password must have at least 7 chars');

    const checkDuplidatedQuery: QueryConfig = {
      text: `
        SELECT id FROM users
        WHERE username = $1 OR email = $2
      `,
      values: [username, email],
    };
    const result = await db.query(checkDuplidatedQuery);

    if (result.rowCount > 0) {
      throw Error('Username or Email is already existed');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const query: QueryConfig = {
      text: `
        INSERT INTO users (first_name, last_name, username, password, email)
        VALUES($1, $2, $3, $4, $5) RETURNING *
      `,
      values: [firstName, lastName, username, hashedPassword, email],
    };

    await db.query(query);
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
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}
