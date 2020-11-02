import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import next from 'next';

import routes from '../src/routes';

const port = 3002;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express();
  server.use(compression());
  server.use(bodyParser.json());
  server.use(cookieParser());
  server.use(handle);

  server.listen(port);

  // tslint:disable-next-line:no-console
  console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
});
