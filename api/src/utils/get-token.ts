export function getToken(authorization: string) {
  if (!authorization || typeof authorization === 'undefined') return;

  const bearer = authorization.split(' ');
  if (bearer.length < 2) return;

  return bearer[1];
}
