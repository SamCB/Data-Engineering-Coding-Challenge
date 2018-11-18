import { Article, ArticleStore, validateArticle } from '../store/article';
import { DataStore } from '../data';

export interface AddArticleResult {
  id: string;
  article: Article;
}

/**
 * Add the given article to the database
 */
export async function addArticle(
  // any because we'll handle validation internally
  article: Article | any,
  key: string,
  // passing the DataStore as an argument instead of keeping a global value
  //  allows for greater ease and flexibility when testing and developing
  //  locally
  data: DataStore,
): Promise<AddArticleResult> {
  if (data.keyValidator(key) === false) {
    throw new Error(`Invalid security key`);
  }
  const validArticle = validateArticle(article);

  const _id = `${validArticle.publisher} - ${validArticle.key}`;
  await data.db.Article.ArticleModel.findByIdAndUpdate(
    _id,
    validArticle,
    { upsert: true}
  );
  return {
    id: _id,
    article: validArticle
  };
}
