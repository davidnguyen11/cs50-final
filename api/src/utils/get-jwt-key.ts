import { readFile } from 'fs';

export function getJWTKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile('jwt.key', 'utf8', function (err, key) {
      if (err) {
        return reject(err);
      }
      resolve(key);
    });
  });
}
