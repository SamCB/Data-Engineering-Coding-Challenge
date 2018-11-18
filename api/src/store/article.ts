import * as Joi from 'joi';
import { Connection, Document, Schema, Model, model } from 'mongoose';

export interface Article {
  key: string;
  title: string;
  url: string;
  publisher: string;
  author: string;
  timePublished: number;
  timeUpdated?: number;
  body: string
}

const joiSchema = Joi.object().keys({
  key: Joi.string().required(),
  title: Joi.string().required(),
  url: Joi.string().required(),
  publisher: Joi.string().required(),
  author: Joi.string().required(),
  timePublished: Joi.number().required(),
  timeUpdated: Joi.number(),
  body: Joi.string().required()
});

export function validateArticle(val: any): Article {
  const result = Joi.validate<Article>(val, joiSchema);
  if (result.error === null) {
    return result.value;
  }
  throw result.error;
}

export interface ArticleModel extends Article, Document {
}

export interface ArticleStore {
  ArticleSchema: Schema;
  ArticleModel: Model<ArticleModel>;
}

export function generateArticleStore(conn: Connection, prefix?: string): ArticleStore {
  const ArticleSchema = new Schema({
    // Because we want the id to be passed in.
    _id: String,
    key: String,
    title: String,
    url: String,
    publisher: { type: String, index: true },
    author: String,
    // Could be date, but since we don't need to do too much complicated with
    // it, will keep it as number for ease of use
    timePublished: Number,
    timeUpdated: Number,
    body: String,
  });
  const ArticleModel = conn.model<ArticleModel>(`${prefix}Article`, ArticleSchema);
  return { ArticleSchema, ArticleModel };
}
