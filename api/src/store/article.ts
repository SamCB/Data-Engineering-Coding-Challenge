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
  body: string;
  keywords: string[];
}

const joiSchema = Joi.object().keys({
  key: Joi.string().required(),
  title: Joi.string().required(),
  url: Joi.string().required(),
  publisher: Joi.string().required(),
  author: Joi.string().required(),
  timePublished: Joi.number().required(),
  timeUpdated: Joi.number(),
  body: Joi.string().required(),
  keywords: Joi.array().items(Joi.string()).required(),
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

export function articleModelToArticle(m: ArticleModel): Article {
  return {
    key: m.key,
    title: m.title,
    url: m.url,
    publisher: m.publisher,
    author: m.author,
    ... m.timeUpdated ? { timeUpdated: m.timeUpdated } : {},
    timePublished: m.timePublished,
    body: m.body,
    keywords: m.keywords,
  }
}

export interface ArticleStore {
  ArticleSchema: Schema;
  ArticleModel: Model<ArticleModel>;
}

export async function generateArticleStore(conn: Connection, prefix?: string): Promise<ArticleStore> {
  const ArticleSchema = new Schema({
    // Because we want the id to be passed in so it can be used as the key, and
    //  we'll have automatic overrides.
    // Admitadly, manually defining this as a string isn't best practice, but
    //  it's quick and easy for now. In the future it could be better handled
    //  with a joint unique index on the publisher and key and some extra logic
    //  surrounding the handling of collisions.
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
    // Convert all keywords to lowercase and trim them
    keywords: { type: [{type: String, lowercase: true, trim: true}], index: true },
  });
  const ArticleModel = conn.model<ArticleModel>(`${prefix || ''}Article`, ArticleSchema);
  await ArticleModel.ensureIndexes();
  return { ArticleSchema, ArticleModel };
}
