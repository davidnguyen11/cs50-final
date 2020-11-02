import { connect } from './connect';
import { QueryResult } from 'pg';
const pool = connect();

export const db = {
  // https://node-postgres.com/features/queries
  query: (text: string, params: any, callback: (err: Error, result: QueryResult<any>) => void) => {
    return pool.query(text, params, callback);
  },
};
