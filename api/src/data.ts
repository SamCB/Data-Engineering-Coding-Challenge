import { ArticleStore } from './store/article';

export interface DataStore {
  keyValidator: (key: string) => boolean;
  db: {
    Article: ArticleStore
  }
}
