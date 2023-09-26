# Budget

App for log yours expenses and income. Based TS, NodeJS, ReactJS, PostgreSQL.

## TODO

-

## ESLINT and Prettier setup

https://blog.logrocket.com/linting-typescript-eslint-prettier/

# Development

**To start development:**

1. Execute in `server` dir `npm run db:up`
2. Execute in `server` dir `npm run dev`
3. Execute in `client` dir `npm run start`

**To stop development:**

1. Ctrl+C in `server` dir
2. Ctrl+C in `client` dir
3. Execute in `server` dir `npm run db:down`

## Server

- `npm run dev`

## Client

- `npm start`

# Production

**To Deploy to production execute** `npm run deploy`

## Build

Build FE and BE

- `npm run build`

## Deploy

Deploy `build` dir to prod

- `npm run deploy`

# Server

Commands execute from root of the project.

## Connect to server via SSH

- `npm run shell`

## Read node logs

- `journalctl -u budget_node_app.service -e`

# Scripts

## Root scripts

- `build:server` Build only server to server `build` dir
- `build:client` Build only client to client `build` dir
- `cp` Copy from server `build` dir to root `build` dir. After that copy client `build` dir to root `build/public` dir.
- `cp:server` Copy only from server `build` dir to root `build` dir.
- `server:install` Execute `npm i --production` in root `build` dir
- `build` Build only server to server `build` dir and Build only client to client `build` dir
- `build:fast` Build only server to server `build` dir and Copy only from server `build` dir to root `build` dir.
- `gulp:deploy` Copy root `build` dir to server dir `/opt/bitnami/projects/budget/`. Install npm dependencies and restart nodeJS server.
- `deploy` Build only server to server `build` dir and Build only client to client `build` dir. Copy from server `build` dir to root `build` dir. After that copy client `build` dir to root `build/public` dir. Copy root `build` dir to server dir `/opt/bitnami/projects/budget/`. Install npm dependencies and restart nodeJS server.
- `shell` Connetct to server via SSH

## Client scripts

- `start` Run dev server for FE
- `build` Build only client to client `build` dir
- `test` Run tests in `tests` dir

## Server scripts

- `start` Start app (usually for prod)
- `dev` Start gulp watch and nodemon (run dev server)
- `build` Build only server to server `build` dir
- `lint` ESlint check TS syntax
- `format` Auto prettier all TS
- `db:up` Up docker container with PostgreSQL DB
- `db:down` Stop and remove docker container with PostgreSQL DB
