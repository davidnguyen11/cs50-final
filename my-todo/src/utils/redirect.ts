import { HttpStatusCode } from './status-code';

export function redirectAtClient(pageUrl) {
  window.location.href = pageUrl;
}

export function redirectAtServer(res, pageUrl) {
  res.redirect(HttpStatusCode.MOVED_PERMANENTLY, pageUrl);
}
