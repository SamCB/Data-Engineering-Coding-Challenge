import App from './app';
import { createDataStore } from './data';

const PORT = process.env.SERVER_PORT;

createDataStore()
.then(
  (dataStore) => {
    console.log('Connected to Database');

    const app = new App(dataStore).app;

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  },
  (err) => {
    console.log('Something went wrong connecting to database');
    console.log(err);
    console.log('HALT');
  }
);
