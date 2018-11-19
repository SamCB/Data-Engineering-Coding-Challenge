import { set as mongooseSet, createConnection, Connection } from 'mongoose';
import { randomBytes } from 'crypto';
import { DataStore } from '../data';
import { generateArticleStore } from '../store/article';

export interface MockDataStore extends DataStore {
  // Recording the prefix and conn allows for easy cleanup
  prefix: string;
  conn: Connection;
}

function genPrefix(): string {
  return randomBytes(10).toString('hex');
}

const LOCAL_DB_ADDRESS = 'mongodb://db:27017/';

export const mockKey = 'abc';

export function genMockDataStore(): MockDataStore {
  // We send a random prefix for creating the database, so as to avoid
  // collisions or using old collections by accident.
  const prefix = genPrefix();

  const connectionAddress = `${LOCAL_DB_ADDRESS}test_${prefix}`;

  // Fix a few depreciation warnings.
  // see: https://mongoosejs.com/docs/deprecations.html for details
  mongooseSet('useNewUrlParser', true);
  mongooseSet('useFindAndModify', false);
  mongooseSet('useCreateIndex', true);

  const conn = createConnection(connectionAddress);

  return {
    prefix,
    conn,
    keyValidator: (key: string) => key === mockKey,
    db: {
      Article: generateArticleStore(conn, prefix)
    }
  }
};

export async function teardownMockDataStore(dataStore: MockDataStore) {
  await dataStore.conn.dropDatabase();
}

