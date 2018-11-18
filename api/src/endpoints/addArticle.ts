import { Article, ArticleStore } from '../store/article';
import { DataStore } from '../data';

export interface AddArticleResult {
  id: string;
  article: Article;
}

/**
 * Add the given article to the database
 */
export async function addArticle(
  article: Article,
  key: string,
  // passing the DataStore as an argument instead of keeping a global value
  //  allows for greater ease and flexibility when testing and developing
  //  locally
  data: DataStore,
): Promise<AddArticleResult> {
}

