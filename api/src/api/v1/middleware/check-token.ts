import * as JSONWebToken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthenResponse } from '../auth/login';
import { getToken } from '../../../utils/get-token';
import { getJWTKey } from '../../../utils/get-jwt-key';

import { HttpStatusCode } from '../../../utils/status-code';
import { JWT_ALGORITHM } from '../../../utils/constants';
import { set } from '../../../utils/response-locals';

export async function checkToken(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req.headers['authorization']);

  if (token) {
    try {
      const auth = await verifyToken(token);

      // store decoded authenticate data to share to each route
      set(res, 'auth', auth);
      next();
    } catch (error) {
      res.status(HttpStatusCode.FORBIDDEN);
      res.send({ error, status: 'error' });
    }
  } else {
    // If header is undefined return Forbidden (403)
    res.sendStatus(HttpStatusCode.FORBIDDEN);
  }
}

function verifyToken(token: string): Promise<AuthenResponse> {
  return new Promise(async (resolve, reject) => {
    const key = await getJWTKey();
    JSONWebToken.verify(token, key, { algorithms: [JWT_ALGORITHM] }, function (err, decoded: AuthenResponse) {
      if (err) {
        return reject(err);
      }

      resolve(decoded);
    });
  });
}
