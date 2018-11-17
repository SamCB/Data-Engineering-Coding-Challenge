import { Article, StoredArticle } from './store/article';
import { DataStore } from './data';

export async function addArticle(
  article: Article,
  key: string,
  // passing the DataStore as an argument instead of keeping a global value
  //  allows for greater ease and flexibility when testing and developing
  //  locally
  data: DataStore,
): Promise<StoredArticle> {

}

export async function getArticle(id: string, key: string): Promise<StoredArticle> {
}
