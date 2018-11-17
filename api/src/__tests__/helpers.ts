import { DataStore } from '../data';

interface MockDataStore extends DataStore {
  prefix: string;
}

export function genMockDataStore(): MockDataStore {
  return {
    prefix: 'abc',
    keyValidator: (key: string) => key === 'abc',
    db: {

    }
  }
};

export async function teardownMockDataStore() {

}
