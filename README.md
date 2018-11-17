# Data-Engineering-Coding-Challenge
My entry to the [Isentia Data Engineering Coding Challenge](https://github.com/Isentia/Coding-Challenge/blob/master/Data-Engineer-Coding-Challenge.md).

## Requirements:

* Docker
* Docker-compose

## Local Dev

All environments are handled by docker.
To run locally, you'll need to use docker-compose.
All services can be pulled and built with:

```bash
docker-compose build
```

To enter the API container for development, run

```bash
docker-compose run --service-ports api bash
# and if you haven't setup the dependencies yet, inside the container run
yarn
```

To enter the scraper container for development run

```bash
docker-compose run scraper bash
```
