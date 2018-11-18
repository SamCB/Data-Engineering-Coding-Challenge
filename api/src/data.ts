import { createConnection } from 'mongoose';
import { ArticleStore, generateArticleStore } from './store/article';

export interface DataStore {
  keyValidator: (key: string) => boolean;
  db: {
    Article: ArticleStore
  }
}

// Fail instantly during setup if either of these are not defined as environment
// variables
const securityKey = process.env.SECURITY_KEY;
if (securityKey === undefined) {
  throw new Error('FATAL: SECURITY_KEY must be defined in env variables');
}

const dbAddress = process.env.DB_ADDRESS;
if (dbAddress === undefined) {
  throw new Error('FATAL: DB_ADDRESS must be defined in env variables');
}

export function createDataStore(): DataStore {
  const conn = createConnection(dbAddress);
  return {
    keyValidator: (key: string) => key === securityKey,
    db: {
      Article: generateArticleStore(conn)
    }
  }
}
