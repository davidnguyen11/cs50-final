const nextRoutes = require('next-routes');
const routes = nextRoutes();

routes.add('home', '/home');
routes.add('image-color', '/image/colors');

export const Link = routes.Link;
export const Router = routes.Router;
export default routes;
