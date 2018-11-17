import { Connection, Document, Schema, Model, model } from 'mongoose';

export interface Article {
  title: string;
  url: string;
  publisher: string;
  author: string;
  timePublished: number;
  timeUpdated?: number;
  body: string
}

export interface ArticleModel extends Article, Document {
}

export interface ArticleStore {
  ArticleSchema: Schema;
  Article: ArticleModel;
}

export function generateArticleStore(conn: Connection, prefix?: string): ArticleStore {
}
