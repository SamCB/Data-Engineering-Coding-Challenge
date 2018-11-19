import { Article } from '../store/article';
import { DataStore } from '../data';

export interface Query {
  keywords: string[];
  cursor?: string;
  publisher?: string;
}

export interface QueryArticleResult {
  query: Query;
  articles: Article[];
  cursor?: string;
}

export async function queryArticle(
  query: Query, dataStore: DataStore
): Promise<QueryArticleResult> {
  return {
    query: {keywords: []},
    articles: []
  }
}
