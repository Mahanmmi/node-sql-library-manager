# NodeJS SQL-Based Library manager

## Running

To run in dev mode (requires local postgres server to be up and running and have username:password & database which are set in .env.dev file) - This is just for development - Not recommended:

```bash
npm run dev
```

To run in production mode (requires docker and docker-compose and an stable internet connection with access to dockerhub) - Takes care of database server and dependancies - Recommended:

```bash
docker-compose --env-file ./.env up 
```

Regardless of which you choose, you can access front-end (interface) on localhost:3000 and back-end (api) on localhost:3000/api
