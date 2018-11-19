import { range, uniqBy } from 'lodash';

import { queryArticle } from '../endpoints/queryArticle';

import { addArticle } from '../endpoints/addArticle';
import { Article } from '../store/Article';

import {
  genMockDataStore,
  teardownMockDataStore,
  mockKey,
  MockDataStore,
  deepCompare,
} from './helpers';

let dataStore: MockDataStore;

const vals: Article[] = [
  {
    key: 'https://example.com/a/how-foobar-changed-world',
    title: 'How Foobar changed the world',
    url: 'https://example.com/a/how-foobar-changed-world',
    publisher: 'example.com',
    author: 'Mr Barfoo',
    timePublished: 1542501881154,
    body: `Want some Unicode? €¶◆← →↑↓①②③😂🤓🤖👨`,
    keywords: ['short', 'important', 'system test', 'Unicode']
  },
  {
    key: 'https://example.com/a/a-second-article',
    title: 'Interesting Article',
    url: 'https://example.com/a/a-second-article',
    publisher: 'example.com',
    author: 'Mr Barfoo',
    timePublished: 1542509881154,
    body: `This is an important, interesting article about some things`,
    keywords: ['some things', 'interesting', 'important', 'Unicode']
  },
  {
    key: 'https://example.com/a/articles-galore',
    title: 'Soooo many Articles',
    url: 'https://example.com/a/articles-galore',
    publisher: 'example.com',
    author: 'Dr Barfoo',
    timePublished: 1542510881154,
    body: `This is another article, there are many like it, but this has no keywords`,
    keywords: []
  },
  {
    key: '12345',
    title: 'Articles exist from multiple publishers',
    url: 'https://example.org/12345',
    publisher: 'The Example Organisation',
    author: 'Mrs Foobar',
    timePublished: 1542515881154,
    body: `Look at this article. It's published somewhere else.`,
    keywords: ['important', 'short', 'somewhere else', 'organisation', 'some things']
  },
];

beforeEach(async () => {
  dataStore = await genMockDataStore();
  await Promise.all(vals.map(val => addArticle(val, mockKey, dataStore)));
});

afterEach(async () => {
  await teardownMockDataStore(dataStore);
});

test('query on one keyword returns all articles with that keyword', async () => {
  const result = await queryArticle({keywords: ['important']}, dataStore);
  expect(deepCompare([vals[0], vals[1], vals[3]], result.articles)).toBeTruthy();
});

test('query on multiple keywords returns all articles with all keywords', async () => {
  const result = await queryArticle({keywords: ['important', 'short']}, dataStore);
  expect(deepCompare([vals[0], vals[3]], result.articles)).toBeTruthy();
});

test('query with specified publisher returns only articles from that publisher', async () => {
  const result = await queryArticle(
    {keywords: ['important'], publisher: 'example.com'},
    dataStore
  );
  expect(deepCompare([vals[0], vals[1]], result.articles)).toBeTruthy();
});

test('query result contains the given query', async () => {
  const query = {keywords: ['important', 'strange'], publisher: 'foobar'};
  const result = await queryArticle(query, dataStore);
  expect(result.query).toEqual(query);
});

describe('more than 10 matching articles', () => {
  function genArticle(i: number): Article {
    return {
      key: `https://example.com/a/something-${i}`,
      title: `A series of articles, #${i}`,
      url: `https://example.com/a/something-${i}`,
      publisher: 'example.com',
      author: 'Mr Barfoo',
      timePublished: 1542501881154 + 13942 * i,
      body: 'A constant body',
      keywords: [`${i}`, `foobar`, `example`, `hello`]
    };
  }
  let generatedArticles: Article[];

  beforeEach(async () => {
    generatedArticles = range(25).map(i => genArticle(i));
    await Promise.all(generatedArticles.map(a => addArticle(a, mockKey, dataStore)));
  });

  test('invalid query raises error', async () => {
    await expect(queryArticle({}, dataStore)).rejects.toThrow();
  });

  test('query on one keyword returns 10 articles', async () => {
    const result = await queryArticle({keywords: ['example']}, dataStore);
    expect(result.articles).toHaveLength(10);
    // Make sure every returned article is a unique record
    expect(uniqBy(result.articles, a => a.key)).toHaveLength(10);
  });
  test('query on one keyword returns a cursor', async () => {
    const result = await queryArticle({keywords: ['example']}, dataStore);
    expect(result.cursor).toBeDefined();
  });
  test('continued querying with returned cursors will return all articles', async () => {
    const resultA = await queryArticle(
      {keywords: ['example']},
      dataStore
    );
    const resultB = await queryArticle(
      {keywords: ['example'], cursor: resultA.cursor},
      dataStore
    );
    const resultC = await queryArticle(
      {keywords: ['example'], cursor: resultB.cursor},
      dataStore
    );
    const articles = [...resultA.articles, ...resultB.articles, ...resultC.articles];

    expect(deepCompare(generatedArticles, articles)).toBeTruthy();
    expect(articles).toHaveLength(25);
  });
  test('query on multiple keywords returns 10 articles', async () => {
    const result = await queryArticle({keywords: ['example', 'foobar']}, dataStore);
    expect(result.articles).toHaveLength(10);
    // Make sure every returned article is a unique record
    expect(uniqBy(result.articles, a => a.key)).toHaveLength(10);
  });
  test('continued querying (multiple keywords) with returned cursors will return all articles', async () => {
    const resultA = await queryArticle(
      {keywords: ['example', 'foobar']},
      dataStore
    );
    const resultB = await queryArticle(
      {keywords: ['example', 'foobar'], cursor: resultA.cursor},
      dataStore
    );
    const resultC = await queryArticle(
      {keywords: ['example', 'foobar'], cursor: resultB.cursor},
      dataStore
    );
    const articles = [...resultA.articles, ...resultB.articles, ...resultC.articles];

    expect(deepCompare(generatedArticles, articles)).toBeTruthy();
  });
  
});
