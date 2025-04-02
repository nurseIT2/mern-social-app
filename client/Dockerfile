FROM node:18-alpine

WORKDIR /app

# Копируем сначала только package.json и package-lock.json для кэширования зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Затем копируем остальные файлы проекта
COPY . .

# Устанавливаем переменные окружения
ENV PORT=3005
ENV CI=false
ENV REACT_APP_API_URL=http://localhost:8080
ENV NODE_ENV=development

# Открываем порт, на котором будет работать приложение
EXPOSE 3005

# Запускаем приложение
CMD ["npm", "start"] 