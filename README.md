# News Site Scraper
My entry to the [Isentia Data Engineering Coding Challenge](https://github.com/Isentia/Coding-Challenge/blob/master/Data-Engineer-Coding-Challenge.md).

It attempts to scrape the last few months of news articles from [abc.net.au](https://abc.net.au),
extract keywords, and present a public api for usage.

For example:

```
GET: http://<server>/article?k=technology,schools
```

returns articles that match both the keywords `technology` and `schools` something like

```javascript
{
  "articles": [
    {
      "key": "https://www.abc.net.au/news/2018-11-14/winning-watch-design-for-colourblind-brother/10497566",
      "title": "Winning watch design for colourblind brother sees schoolboy set to visit NASA",
      "url": "https://www.abc.net.au/news/2018-11-14/winning-watch-design-for-colourblind-brother/10497566",
      "publisher": "abc.net.au",
      "author": "ABC Gold Coast",
      "timePublished": 1542216828,
      "body": "Winning watch design for colourblind brother sees schoolboy set to visit NASA...",
      "keywords": ["yet", "year", "world", /*...*/]
    },
    /*...*/
  ],
  "cursor": "eyJrZXl3b3JkcyI6WyJ0ZWNobm9sb2d5Il0sInNraXAiOjEwfQ=="
}
```

A maximum of 10 articles will be provided per query.
If `cursor` is returned, it can be passed as part of the query to retrieve more articles

```
GET: http://<server>/article?k=technology,schools&cursor=eyJrZXl3b3JkcyI6WyJ0ZWNobm9sb2d5Il0sInNraXAiOjEwfQ==
```

## Requirements:

* Docker
* Docker-compose

## Local Dev

All environments are handled by docker.
To run locally, you'll need to use docker-compose.

You first need to setup the environment file.

```bash
cp .env.example .env
```

And update the values.
If you are using an external service such as [compose](http://www.compose.com), update the address
according to the [mongo connection string format](https://docs.mongodb.com/manual/reference/connection-string/).
A local mongo instance is provided as a docker container and is accessible from the api container via `db:27017`.

All services can be pulled and built with:

```bash
docker-compose build
```

### API Dev

The API is written in typescript.
It makes use of the express framework and uses the mongoose library for storage.

To enter the API container for development, run

```bash
docker-compose run --service-ports api bash
# and if you haven't setup the dependencies yet, inside the container run
yarn
```

System tests have been written for the API and are found in:
`api/src/__tests__/`.
They are written in the [jest framework](https://jestjs.io/).
They can be run inside the container with

```bash
yarn test
# or to enable 'watch mode', refreshing the tests after file changes
yarn test:watch
```

To run the api in development, where changes restart the server, run:

```bash
yarn watch
```

### Scraper Dev

The Scraper/Spider is written in python.

To enter the scraper container for development run

```bash
docker-compose run scraper bash
```

Tests have been written for the scraper (but not the spider) and are found in:
`scraper/src/tests`.
To run the tests, from inside the container:

```bash
python -m unitttest tests.parser_test
```

To run the scraper (which will immediately try scraping and saving to the api)
run the following in the container:

```bash
python index.py
```

## Local Runtime

To simply run all services locally you can run:

```bash
docker-compose up scraper
```

It will use whatever database is configured in `.env`.

## Production Deployment

Deployment onto a production server shouldn't be difficult.
In the future, I'd like to automate this with cloudformation,
but for now the following should work.

1. Clone the repositry onto the target server.
2. Configure the `.env` file.
3. Build with `docker-compose build`.
4. Run as backround process `docker-compose up -d scraper_prod`.

You will probably need to do some port configuration on the server to be able to access the api.

## Design and Design Decisions

The API and Scraper are written independently and run in seperate containers to maintain seperation of concerns.
The API is the only component responsible for reading and writing from the database.
As such, there are two api endpoints, a `GET` for querying articles and a `POST` for adding them.
The scraper adds to the database via the `POST - article` endpoint.
A security key shared as an environment variable ensures that only the Scraper can use the `POST` endpoint.
All users can query using the `GET` endpoint.

As desiging the API and Scraper I was keeping in mind maintainability and possible future extension.
For example:
* It is very easy to add new news sources, they only need a seperate scraper to be added.
* Different news sources can already be individually queried using the `publisher` query key.
* Multiple scrapers can be run in different containers to improve efficiency.
* API already accepts updating articles, by `POST`ing with an identical `key`.

Because of maintainability mindfulness, the following features would be trivial to implement.
* An API endpoint for returning the most recently published article recorded, would allow for stateless scrapers to boot periodically and look for new articles.
* New scrapers for new news-sources.
* Multiple data parsers for individual news-sources, to allow for cases where articles have different formats.

Thank you for taking the time to look at my submission.
I look forward to discussing future opportunities working together.
