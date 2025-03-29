FROM node:18-alpine

WORKDIR /app

# Копируем сначала только package.json и package-lock.json для кэширования зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --silent

# Затем копируем остальные файлы проекта
COPY . .

# Устанавливаем переменные окружения
ENV PORT=3000
ENV CI=false
ENV REACT_APP_API_URL=http://localhost:8080
ENV NODE_ENV=development

# Открываем порт, на котором будет работать приложение
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"] 