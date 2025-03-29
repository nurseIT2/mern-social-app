# Руководство по запуску MERN проекта в Docker

Этот документ содержит пошаговые инструкции по запуску проекта с использованием Docker и Docker Compose.

## Предварительные требования

1. Установленный [Docker](https://docs.docker.com/get-docker/)
2. Установленный [Docker Compose](https://docs.docker.com/compose/install/) (входит в Docker Desktop для Windows и Mac)

## Структура проекта с Docker

```
├── client/                      # React приложение
│   ├── Dockerfile               # Dockerfile для клиентской части
│   └── ...
├── server/                      # Express API
│   ├── Dockerfile               # Dockerfile для серверной части
│   └── ...
├── docker-compose.yml           # Конфигурация Docker Compose
├── .dockerignore                # Файлы, исключаемые из Docker образов
└── ...
```

## Шаги для запуска проекта в Docker

### 1. Клонирование репозитория

Если вы еще не клонировали репозиторий:

```bash
git clone <url-репозитория>
cd <имя-репозитория>
```

### 2. Создание образов и запуск контейнеров

Выполните следующую команду в корневой директории проекта:

```bash
docker compose up
```

Для запуска в фоновом режиме используйте флаг `-d`:

```bash
docker compose up -d
```

При первом запуске Docker:
- Создаст образы для клиента и сервера на основе Dockerfile
- Скачает образ MongoDB из Docker Hub
- Создаст и запустит контейнеры
- Настроит сеть между контейнерами

### 3. Доступ к приложению

После успешного запуска контейнеров приложение будет доступно:

- **Frontend (React)**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **MongoDB**: mongodb://localhost:27017 (с учетными данными из docker-compose.yml)

### 4. Просмотр логов

Для просмотра логов всех контейнеров:

```bash
docker compose logs -f
```

Для просмотра логов конкретного сервиса:

```bash
docker compose logs -f client   # Логи React приложения
docker compose logs -f server   # Логи Express сервера
docker compose logs -f mongodb  # Логи MongoDB
```

### 5. Остановка контейнеров

Для остановки и удаления контейнеров:

```bash
docker compose down
```

Для остановки, удаления контейнеров и томов (удаляет все данные из MongoDB и загруженные файлы):

```bash
docker compose down -v
```

### 6. Пересборка образов

Если вы внесли изменения в Dockerfile или хотите обновить образы:

```bash
docker compose build --no-cache
```

И затем запустите контейнеры снова:

```bash
docker compose up -d
```

## Полезные команды Docker

### Просмотр запущенных контейнеров

```bash
docker compose ps
```

### Выполнение команд внутри контейнера

Для выполнения команд внутри контейнера (например, установка новых пакетов):

```bash
# Выполнение команды в контейнере клиента
docker compose exec client npm install some-package

# Выполнение команды в контейнере сервера
docker compose exec server npm install some-package

# Запуск интерактивного shell в контейнере
docker compose exec server sh
```

### Просмотр образов

```bash
docker images
```

### Просмотр томов

```bash
docker volume ls
```

## Устранение неполадок

### Контейнер не запускается

Проверьте логи:

```bash
docker compose logs -f service_name
```

### Проблемы с подключением к MongoDB

Убедитесь, что строка подключения в MongoDB в `.env` или `docker-compose.yml` правильная.

### Перезапуск сервисов

```bash
docker compose restart service_name
```

## Особенности Docker-конфигурации проекта

- **Горячая перезагрузка**: Изменения в коде клиента и сервера применяются без перезапуска контейнеров
- **Тома (volumes)**: Данные MongoDB и загруженные файлы сохраняются между перезапусками
- **Health check**: Контейнеры ждут готовности зависимых сервисов
- **Доступ к MongoDB**: MongoDB защищена учетными данными для безопасности 

## Использование скрипта docker-utils.sh

Для упрощения работы с Docker, в проекте есть скрипт `docker-utils.sh`, который предоставляет удобный интерфейс для управления контейнерами.

### Сделать скрипт исполняемым

```bash
chmod +x docker-utils.sh
```

### Доступные команды

```bash
# Запуск контейнеров
./docker-utils.sh start

# Остановка контейнеров
./docker-utils.sh stop

# Перезапуск контейнеров
./docker-utils.sh restart

# Пересборка и запуск контейнеров
./docker-utils.sh rebuild

# Просмотр логов всех сервисов
./docker-utils.sh logs

# Просмотр логов конкретного сервиса
./docker-utils.sh logs server
./docker-utils.sh logs client
./docker-utils.sh logs mongodb

# Выполнение команды внутри контейнера
./docker-utils.sh exec server npm install some-package
./docker-utils.sh exec client sh

# Удаление всех данных (MongoDB и загруженные файлы)
./docker-utils.sh clean

# Информация о запущенных контейнерах
./docker-utils.sh info

# Справка по всем командам
./docker-utils.sh
```

### Преимущества использования скрипта

- Удобный цветной вывод
- Проверка наличия Docker и Docker Compose
- Подтверждение потенциально опасных операций
- Простота использования
- Унифицированный интерфейс для всех команд 