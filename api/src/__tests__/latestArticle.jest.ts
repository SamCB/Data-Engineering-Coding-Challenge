import { addArticle } from '../endpoints/addArticle';
import { latestArticle } from '../endpoints/latestArticle';
import { Article } from '../store/Article';

import { genMockDataStore, teardownMockDataStore, mockKey, MockDataStore } from './helpers';

let dataStore: MockDataStore;

const insertArticles: Article[] = [
  {
    key: 'https://example.com/a/barfoofoofoobar',
    title: 'A Barfoofoofoobar',
    url: 'https://example.com/a/barfoofoofoobar',
    publisher: 'example.com',
    author: 'Dr Barfoo',
    timePublished: 1542501881159,
    timeUpdated: 1542501981159,
    body: 'Something Else'
  },
  {
    key: 'https://example.com/a/how-foobar-changed-world',
    title: 'How Foobar changed the world',
    url: 'https://example.com/a/how-foobar-changed-world',
    publisher: 'example.com',
    author: 'Mr Barfoo',
    timePublished: 1542501881154,
    body: 'Want some Unicode? €¶◆← →↑↓①②③😂🤓🤖👨'
  },
  {
    key: '122532',
    title: 'TDD for dummies',
    url: 'https://example.net/a/122532',
    publisher: 'Example Net',
    author: 'Sam',
    timePublished: 1542601881154,
    body: ' An article'
  }
];

beforeEach(async () => {
  dataStore = genMockDataStore();
  // Populate the database with test data
  await Promise.all(
    insertArticles.map(article => addArticle(article, mockKey, dataStore))
  );
});

afterEach(async () => {
  await teardownMockDataStore(dataStore);
});

test('latestArticle returns article with latest timePublished for the given publisher', async () => {
  const res = await latestArticle('example.com', mockKey, dataStore);
  expect(res.article).toBe(insertArticles[0]);
});

test('latestArticle returns undefined when there are no articles for the publisher', async () => {
  const res = await latestArticle('Not A Publisher', mockKey, dataStore);
  expect(res).toBe(undefined);
});

test('latestArticle raises error when there is no provided security key', async () => {
  expect(async ()=> {
    await latestArticle('example.com', undefined, dataStore);
  }).toThrow();
});

test('latestArticle raises error when the security key is incorrect', async () => {
  expect(async ()=> {
    await latestArticle('example.com', `${mockKey}-oops`, dataStore);
  }).toThrow();
});
