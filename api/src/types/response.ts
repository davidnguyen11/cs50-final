import { Status } from './status';
import { HttpStatusCode } from '../utils/status-code';

export interface APIResponse<T> {
  status: Status;
  statusCode?: HttpStatusCode;
  data?: T;
  error?: {
    message: string;
  };
}
