import * as Joi from 'joi';
import { QueryCursor } from 'mongoose';
import { isEqual } from 'lodash';

import { Article, ArticleModel, articleModelToArticle } from '../store/article';
import { DataStore } from '../data';

export interface Query {
  keywords: string[];
  cursor?: string;
  publisher?: string;
}

const joiQuerySchema = Joi.object().keys({
  keywords: Joi.array().items(Joi.string()).required(),
  cursor: Joi.string(),
  publisher: Joi.string()
});

function validateQuery(val: any): Query {
  const result = Joi.validate<Query>(val, joiQuerySchema);
  if (result.error === null) {
    return result.value;
  }
  throw result.error;
}

export interface QueryArticleResult {
  query: Query;
  articles: Article[];
  cursor?: string;
}

export async function queryArticle(
  // any because we handle data validation internally
  query: Query | any,
  dataStore: DataStore
): Promise<QueryArticleResult> {
  const validQuery = validateQuery(query);

  const queryKeywords = { keywords: { $all: query.keywords } };
  const queryPublisher = query.publisher ? { publisher: query.publisher } : {};
  const skip = query.cursor ? decodeCursor(query) : 0;

  const mongoCursor = dataStore.db.Article.ArticleModel
    .find({
      ...queryKeywords,
      ...queryPublisher
    })
    .skip(skip)
    .cursor();

  const articles = await parseCursor(mongoCursor);
  if (articles.length === 10 && await mongoCursor.next() !== null) {
    // there are still more records to fetch, include a cursor in return
    return {
      query: validQuery,
      articles: articles,
      cursor: encodeCursor(validQuery, skip + 10)
    }
  }

  return {
    query: validQuery,
    articles: articles
  }

}

// The cursor will have information on the query, and the number to continue
//  the query from, encoded as a base64 json blob.
// This isn't a perfect cursor method, given changes in the data may change
//  the order of records returned, however it's easy, fast and returned data
//  for text searches is rarely expected to be exhaustive.
function encodeCursor(query: Query, nextSkip: number): string {
  const json = JSON.stringify({
    keywords: query.keywords,
    publisher: query.publisher,
    skip: nextSkip
  });
  return Buffer.from(json, 'utf8').toString('base64');
}

class InvalidCursor extends Error {
  public isInvalidCursor: boolean = true;
}

function decodeCursor(query: Query): number {
  let savedQuery;
  try {
    const json = Buffer.from(query.cursor, 'base64').toString('utf8');
    savedQuery = JSON.parse(json);
  } catch (e) {
    throw new InvalidCursor('Could not parse cursor string');
  }

  // Sanity check to make sure that the cursor actually applies to the query
  // we are performing
  if (!isEqual(savedQuery.keywords, query.keywords)) {
    throw new InvalidCursor('Cursor does not match query');
  } else if (!isEqual(savedQuery.publisher, query.publisher)) {
    throw new InvalidCursor('Cursor does not match query');
  }

  return savedQuery.skip;
}

// Recursive function to create max length 10 array on articles retrieved by query.
async function parseCursor(cursor: QueryCursor<ArticleModel>, n?: number): Promise<Article[]> {
  n = n || 0;

  if (n === 10) {
    return [];
  }
  const next = await cursor.next();
  if (next === null) {
    return [];
  }
  return [articleModelToArticle(next), ...await parseCursor(cursor, n+1)];
}

