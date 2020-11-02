import * as bcrypt from 'bcrypt';
import * as JSONWebToken from 'jsonwebtoken';
import { APIResponse } from 'response';
import { Auth } from '../models/auth';
import { DB } from '../../../types/db';
import { QueryConfig } from '../../../types/query-config';
import { HttpStatusCode } from '../../../utils/status-code';
import { JWT_ALGORITHM } from '../../../utils/constants';
import { getJWTKey } from '../../../utils/get-jwt-key';

export async function login(db: DB, args: Args) {
  const { username, password: plainPassword } = args;
  const response: APIResponse<Auth> = {
    status: 'fetching',
  };

  const query: QueryConfig = {
    text: `
      SELECT * FROM users
      where username = $1 AND active = True
    `,
    values: [username],
  };

  try {
    const data = await db.query(query);
    if (!data.rowCount) {
      throw Error('User is not existed');
    }

    const { id, password } = data.rows[0];
    const valid = await bcrypt.compare(plainPassword, password);

    if (!valid) {
      throw Error('Username or Password is valid');
    }

    const token = await authenticate({ userId: id });
    response.data = { token };
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

function authenticate(data: AuthenResponse): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const key = await getJWTKey();
    JSONWebToken.sign(data, key, { algorithm: JWT_ALGORITHM }, function (err, token) {
      if (err) {
        return reject(err);
      }

      resolve(token);
    });
  });
}

export interface AuthenResponse {
  userId: number;
  iat?: number;
}

interface Args {
  username: string;
  password: string;
}
