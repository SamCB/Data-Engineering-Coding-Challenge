import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Routes } from './routes';
import { DataStore } from './data';

export default class App {
  public app: express.Application;
  public router: Routes;

  constructor(dataStore: DataStore) {
    this.app = express();
    // supporting JSON body
    this.app.use(bodyParser.json());

    this.router = new Routes(dataStore);
    this.router.routes(this.app);
  }

}
