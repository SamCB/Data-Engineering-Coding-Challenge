import { Article, ArticleStore } from '../store/article';
import { DataStore } from '../data';

export interface LatestArticleResult {
  id: string;
  article: Article;
}

/**
 * Return the latest article from a given publisher
 */
export async function latestArticle(
  publisher: string,
  key: string,
  // passing the DataStore as an argument instead of keeping a global value
  //  allows for greater ease and flexibility when testing and developing
  //  locally
  data: DataStore,
): Promise<LatestArticleResult|undefined> {
}

