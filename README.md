# MERN Stack Application with Docker

Это приложение построено на стеке MERN (MongoDB, Express.js, React.js, Node.js) и контейнеризировано с использованием Docker.

## Структура проекта

- `client/` - React.js фронтенд
- `server/` - Node.js/Express бэкенд
- `docker-compose.yml` - конфигурация для запуска всех контейнеров
- `client/Dockerfile` и `server/Dockerfile` - инструкции для сборки контейнеров

## Порты

- Frontend (React): 
  - Host: 3000
  - Container: 3000
- Backend (Express): 
  - Host: 8080
  - Container: 8080
- MongoDB: 
  - Host: 27017
  - Container: 27017

## Запуск проекта с Docker

### Предварительные требования

- Docker и Docker Compose

### Шаги для запуска

1. Клонируйте репозиторий:
```bash
git clone <url-репозитория>
cd <имя-репозитория>
```

2. Запустите контейнеры с помощью Docker Compose:
```bash
docker compose up
```

Для запуска в фоновом режиме:
```bash
docker compose up -d
```

3. Для остановки контейнеров:
```bash
docker compose down
```

4. Для просмотра логов:
```bash
docker compose logs -f
```

## Доступ к приложению

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- MongoDB: mongodb://localhost:27017

## Работа с проектом

### Frontend (React)

- Исходный код находится в директории `client/src`
- Запускается на порту 3000 на вашем хосте
- Внутри контейнера работает на порту 3000

### Backend (Node.js/Express)

- Исходный код находится в директории `server`
- API доступно по адресу http://localhost:8080
- Внутри контейнера работает на порту 8080

### База данных (MongoDB)

- Данные MongoDB сохраняются в Docker volume `mongo-data`
- Доступна как для бэкенда под именем хоста `mongodb`

## Особенности реализации

- Данные MongoDB сохраняются в Docker volume и не удаляются при перезапуске контейнеров
- Загруженные изображения хранятся в volume `server-images`
- Присутствует поддержка горячей перезагрузки (hot reload) как для frontend, так и для backend

## Git Hooks и Code Quality Tools

Проект использует следующие инструменты для обеспечения качества кода:

- **Husky** - запускает скрипты перед коммитом или пушем изменений
- **Lint-staged** - запускает линтеры только на измененных файлах перед коммитом
- **Commitlint** - проверяет соответствие сообщений коммитов стандартам
- **ESLint** - статический анализ кода для выявления проблемных паттернов
- **Prettier** - форматирование кода для обеспечения единого стиля

### Установка Git Hooks

После клонирования репозитория выполните:

```bash
npm install
```

Это автоматически настроит Git Hooks через скрипт `prepare`.

### Как это работает

- При попытке коммита изменений автоматически запускаются линтеры и форматтеры
- Коммит будет отклонен, если есть ошибки в коде или неправильный формат коммит-сообщения
- Сообщения коммитов должны соответствовать [Conventional Commits](https://www.conventionalcommits.org/)

Для получения дополнительной информации см. [GIT_HOOKS_README.md](./GIT_HOOKS_README.md)

# Nodester

## Project Background

**Nodester** is a very simple Twitter-like single page app built with the MERN stack. This project delves deeper into NodeJS and the organization of the back end server work flow.  

## Benefits of Project

Nodester helps to improve your server side in general with the use of NodeJS and its various libraries.  It use an MVC framework to organize the routes, RESTful APIs, and models, so you can easily understand where relevant code is quicker when updating, installing a new feature, or troubleshooting.  

## Objectives for this project

* Learn more advanced skills in server side development with the use of NodeJS

* Use Epxress JS web framework to write cleaner simpler code for server creation

* Better understand the MVC pattern of organization for server side code

* Write more advanced RESTful APIs with NodeJS and the Express web framework to serve data to the React front end

* Get an introduction to NoSQL databases with the use of mongoDB and the mongoose library

* Implement more advance authentication with encryption and tokens

* Better understand server side validation and error handling

## Outcome

Nodester is a well designed MERN stack project that helps you learn more advanced skills in NodeJS and server development in general.  You will be able to advance your skills in MVC, RESTful APIs, Authentication, server side error handling, NoSQL database, mongoDB, mongoose, and more.  

## Assumptions

This project assumes that you have a working knowledge of HTML, CSS, Javascript, and NodeJS.  Docs for each library and framework used are linked below 

## Project Links

Github repo: https://github.com/renecruzATX/node-REST-API-project

NodeJS docs: https://nodejs.org/en/docs/

Express JS docs: https://expressjs.com/en/5x/api.html

mongoDB docs: https://docs.mongodb.com/

mongoose JS docs: https://mongoosejs.com/docs/guide.html

React JS docs: https://reactjs.org/docs/getting-started.html

## Project Start Commands

Client start in client folder: ```npm start``` 

Server start in server folder: ```node app.js```


## Application Screenshots

Feed Page

<img src="/public/nodesterFeedPage.png" alt="alt text" width="75%" height="75%">

Login Page

<img src="/public/nodesterLoginPage.png" alt="alt text" width="75%" height="75%">

Single Post

<img src="/public/nodesterSinglePost.png" alt="alt text" width="75%" height="75%">

New Post Screen

<img src="/public/nodesterNewPost.png" alt="alt text" width="75%" height="75%">

## Docker-развертывание

Для быстрого запуска проекта вы можете использовать Docker:

```bash
# Запуск всех сервисов
docker compose up -d

# Остановка всех сервисов
docker compose down
```

Приложение будет доступно:
- Клиент: http://localhost:3000
- API: http://localhost:8080

Для упрощения работы с Docker, вы можете использовать скрипт `docker-utils.sh`:

```bash
# Сделать скрипт исполняемым (только один раз)
chmod +x docker-utils.sh

# Запуск контейнеров
./docker-utils.sh start

# Просмотр логов сервера
./docker-utils.sh logs server

# Справка по всем командам
./docker-utils.sh
```

Подробное руководство по использованию Docker находится в файле [DOCKER_GUIDE.md](DOCKER_GUIDE.md).
# mern-social-app
