/**
 * Store data at "locals" attribute of "response"
 * It's helpful for sharing data from middleware to "response" param
 */
import { Response } from 'express';

export function get<T>(res: Response, key: string): T {
  return res.locals[key];
}

export function set<T>(res: Response, key: string, value: T) {
  res.locals[key] = value;
}
