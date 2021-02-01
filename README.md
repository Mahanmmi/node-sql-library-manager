# NodeJS SQL-Based Library manager

## Dev Mode

To run in dev mode (requires local postgres server to be up and running and have username:password & database which are set in .env.dev file) - This is just for development:

```bash
npm run dev
```
## Production mode (recommended)

To run in production mode (requires docker and docker-compose and an stable internet connection with access to dockerhub) - Takes care of database server and dependancies:

First you'll need to [install Docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/) then navigate to project directory setup .env file (an example file is provided .env.prod.example) and start the container

```bash
docker-compose up 
```

Regardless of which you choose, you can access front-end (interface) on localhost:3000 and back-end (api) on localhost:3000/api
