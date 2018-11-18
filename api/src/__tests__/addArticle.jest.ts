import { clone, keys } from 'lodash';

import { addArticle } from '../addArticle';
import { Article } from '../store/Article';

import { genMockDataStore, teardownMockDataStore, mockKey, MockDataStore } from './helpers';

let dataStore: MockDataStore;

const val: Article = {
  // It's imaginable to use the url as a key
  key: 'https://example.com/a/how-foobar-changed-world',
  title: 'How Foobar changed the world',
  url: 'https://example.com/a/how-foobar-changed-world',
  publisher: 'example.com',
  author: 'Mr Barfoo',
  timePublished: 1542501881154,
  body:
`This is a short article. Not because it is not important, but because...

I'm only using it as a system test.

Want some Unicode? €¶◆← →↑↓①②③😂🤓🤖👨
`
};

beforeEach(() => {
  dataStore = genMockDataStore();
});

afterEach(async () => {
  await teardownMockDataStore(dataStore);
});

test('addArticle will add the given article to the database', async ()=> {
  const res = await addArticle(val, mockKey, dataStore);
  expect(res.id).toBeDefined();
  expect(res.article).toBe(val);
});

test('addArticle will throw an error when there is no provided security key', async ()=> {
  expect(async ()=> {
    await addArticle(val, undefined, dataStore);
  }).toThrow();
});

test('addArticle will throw an error when the security key is incorrect', async ()=> {
  expect(async ()=> {
    await addArticle(val, `${mockKey}-oops-not-it`, dataStore);
  }).toThrow();
});

// Iterate over each key to remove
test.each(keys(val))
('addArticle will throw an error when there is some essential part missing', async (key)=> {
  const newVal = clone(val);
  delete newVal[key];

  expect(async ()=> {
    await addArticle(val, mockKey, dataStore);
  }).toThrow();
});

test('addArticle will override an old article when given the same article key', async ()=> {
  const resA = await addArticle(val, mockKey, dataStore);
  expect(resA.id).toBeDefined();
  const newVal = clone(val);
  newVal.title = 'How Foobar changed the world [updated]';
  newVal.author = 'Dr Barfoo';
  newVal.timeUpdated = 1542501981154;
  const resB = await addArticle(newVal, mockKey, dataStore);
  expect(resB.id).toBe(resA.id);
  expect(resB.article).toBe(newVal);
});
