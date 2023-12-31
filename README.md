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

[apache setup](https://docs.bitnami.com/general/infrastructure/nodejs/get-started/get-started/#step-3-serve-your-application-through-the-apache-web-server)

Commands execute from root of the project.

## Connect to server via SSH

- `npm run shell`

## Read node logs

- `journalctl -u budget_node_app.service -e`

# Scripts

## Root scripts

- `build:server` Build only server to server `build` dir
- `test:server` Run unit tests for server
- `build:client` Build only client to client `build` dir
- `test:client` Run unit tests for client
- `cp` Copy from server `build` dir to root `build` dir. After that copy client `build` dir to root `build/public` dir.
- `cp:server` Copy only from server `build` dir to root `build` dir.
- `server:install` Execute `npm i --production` in root `build` dir
- `build` Run all unit tests before. Build only server to server `build` dir and Build only client to client `build` dir
- `build:fast` Build only server to server `build` dir and Copy only from server `build` dir to root `build` dir.
- `gulp:deploy` Copy root `build` dir to server dir `/opt/bitnami/projects/budget/`. Install npm dependencies and restart nodeJS server.
- `deploy` Build only server to server `build` dir and Build only client to client `build` dir. Copy from server `build` dir to root `build` dir. After that copy client `build` dir to root `build/public` dir. Copy root `build` dir to server dir `/opt/bitnami/projects/budget/`. Install npm dependencies and restart nodeJS server.
- `shell` Connect to server via SSH

## Client scripts

- `start` Run dev server for FE
- `build` Build only client to client `build` dir
- `test` Run tests in watch mode.
- `test:all` Run all tests. Use it before deploy.

## Server scripts

- `start` Start app (usually for prod)
- `dev` Start gulp watch and nodemon (run dev server)
- `build` Build only server to server `build` dir
- `lint` ESlint check TS syntax
- `format` Auto prettier all TS
- `db:up` Up docker container with PostgreSQL DB
- `db:down` Stop and remove docker container with PostgreSQL DB
- `test:all` Run all tests. Use it before deploy.

# ENV (./server/src/.env)

```
# Server

# Server development

SERVER_PORT_DEV=3080

# Server production

SERVER_PORT=3000
SERVER_JWT_SECRET={some pass}
SERVER_EMAIL_PASS={pass from gmail account. Search App password in security settings and create new one.}
SERVER_EMAIL_USER={gmail address}
SERVER_LOGOUT_TIMER={token expired time}
SERVER_HOST_NAME={prod host name}

# DB

# DB development

DB_HOST_DEV=localhost
DB_PORT_DEV=3432
DB_USERNAME_DEV=admin
DB_PASSWORD_DEV=secret

# DB production

DB_HOST={prod DB host}
DB_PORT=5432
DB_USERNAME={DB user}
DB_PASSWORD={DB pass}
DB_NAME=budget
```

# Migration

## Categories migration

`EMAIL={form user} USER_ID={to user} MIGRATION=categories DB_HOST={} DB_PORT=5432 DB_USERNAME={} DB_PASSWORD={} DB_NAME=budget  node utils/migration.js`

## Budget migration

`EMAIL={from user} USER_ID={to user} MIGRATION=budget DB_HOST={} DB_PORT=5432 DB_USERNAME={} DB_PASSWORD={} DB_NAME=budget  node utils/migration.js`

## Weather migration

`EMAIL={from user} USER_ID={to user} MIGRATION=weather WEATHER_ID={} DB_HOST={} DB_PORT=5432 DB_USERNAME={} DB_PASSWORD={} DB_NAME=budget  node utils/migration.js`

# Dump DB

### Make DB dump from prod.

`pg_dump -Fc -v -d postgres://[user]:[password]@ep-long-resonance-58313585.eu-central-1.aws.neon.tech/budget -f ./dump/budgetdump.bak`

### Drop all current tables on dev env.

```
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS budget;
DROP TABLE IF EXISTS weather;
```

### Import prod DB to dev env.

`pg_restore -v -d postgres://[user]:[password]@localhost:3432/budget ./dump/budgetdump.bak`

# Logs

- `journalctl -u budget_node_app.service -r -n 50` This how ypu can check logs on production. 50 - number of rows. r - load data from end of the file.

# Production setup (Light Sail)

## Light Sail

[docs](https://docs.bitnami.com/general/infrastructure/nodejs/get-started/get-started/#step-3-serve-your-application-through-the-apache-web-server)

- copy project to `/opt/bitnami/projects/budget`
- `sudo chown $USER /opt/bitnami/projects/budget`

### Daemonize app via System D

- `sudo vim /etc/systemd/system/budget_node_app.service`

```
[Unit]
Description=Budget NodeJS App
After=multi-user.target

[Service]
ExecStart=/opt/bitnami/node/bin/node /opt/bitnami/projects/budget/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=budget-node-app
User=bitnami
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

- `sudo systemctl start budget_node_app.service` - to start process
- `sudo systemctl status budget_node_app.service` - to check that process is running
- `journalctl -u budget_node_app.service -r -n 50` - if error to check logs
- `sudo systemctl daemon-reload` - to restart daemon if service file was changed
- `sudo systemctl restart budget_node_app.service` - restart process
- `sudo systemctl enable budget_node_app.service` - to auto start process after server restart
- `sudo cat /var/log/messages` - theoretical place of logs

### Setup apache

- `sudo cp /opt/bitnami/apache/conf/vhosts/sample-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/budget-vhost.conf`

```
<VirtualHost _default_:80>
        ServerName budget.me
        ServerAlias *
        DocumentRoot "/opt/bitnami/projects/budget/public"
        <Directory "/opt/bitnami/projects/budget/public">
                Require all granted
        </Directory>
        ProxyPass / http://localhost:3000/
        ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

- `sudo mv 00_status-vhost.conf 00_status-vhost.conf.disable`
- `sudo /opt/bitnami/ctlscript.sh restart apache`
