
## Access backend and write .env 

Access backend in terminal and duplicate file .env-sample and rename it in .env :
```
$ cd backend
```
```
$ cp .env-sample .env
```

Update this file by writing your informations (database informations, secret token)

For this project, env variables are : 
DB_HOST=localhost
DB_USER=userproject7
DB_PASSWORD=mdp-project7
DB_NAME=groupomania

SECRET_TOKEN=RANDOM_TOKEN_SECRET

## Install dependencies
```
$ yarn
```

## Launch server
```
yarn start
```