import App from './app';
import { createDataStore } from './data';

const PORT = 3000;

const dataStore = createDataStore();
const app = new App(dataStore).app;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

console.log('Hello World!');
