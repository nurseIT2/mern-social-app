FROM node:18-alpine

WORKDIR /app

# Копируем сначала только package.json и package-lock.json для кэширования зависимостей
COPY package*.json ./

# Устанавливаем nodemon глобально и зависимости проекта
RUN npm install -g nodemon && npm install

# Затем копируем остальные файлы проекта
COPY . .

# Создаем директорию для загрузки изображений
RUN mkdir -p images && chmod 777 images

# Устанавливаем переменные окружения
ENV NODE_ENV=development
ENV PORT=8085

# Открываем порт, на котором будет работать сервер
EXPOSE 8085

# Запускаем сервер
CMD ["npm", "start"] 