import { Request, Response } from 'express';

import { addArticle } from './endpoints/addArticle';
import { DataStore } from './data';

export class Routes {

  private dataStore: DataStore;

  constructor (dataStore: DataStore) {
    this.dataStore = dataStore;
  }

  public routes(app): void {
    app.route('/article').get((req: Request, res: Response) => {
      res.status(501).send({message: 'GET on article unavailable'});
    });
    app.route('/article').post(async (req: Request, res: Response) => {
      const key = req.get('key');
      try {
        const result = await addArticle(req.body, key, this.dataStore);
        res.status(200).send(`Article ${result.article.key} added`);
      } catch (e) {
        if (e.isJoi) {
          // Input Validation Error
          const errorMessages = e.details.map(detail => detail.message);
          const output = `Invalid Article: ${errorMessages.join(', ')}`;
          res.status(400).send(output);
        } else if (e.isSecurityKey) {
          // Doesn't have valid security credentials
          res.status(403).send('Must have valid "key" defined in header');
        } else {
          // Something else went wrong
          res.status(501).send('Internal Server Error');
        }
      }
    });
  }
}
