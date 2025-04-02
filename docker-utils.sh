#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
print_message() {
  echo -e "${BLUE}[DOCKER-UTILS]${NC} $1"
}

# Функция для вывода успешных сообщений
print_success() {
  echo -e "${GREEN}[DOCKER-UTILS]${NC} $1"
}

# Функция для вывода ошибок
print_error() {
  echo -e "${RED}[DOCKER-UTILS]${NC} $1"
}

# Функция для вывода предупреждений
print_warning() {
  echo -e "${YELLOW}[DOCKER-UTILS]${NC} $1"
}

# Проверяем наличие Docker
check_docker() {
  if ! command -v docker &> /dev/null; then
    print_error "Docker не установлен. Пожалуйста, установите Docker: https://docs.docker.com/get-docker/"
    exit 1
  fi
  
  if ! command -v docker compose &> /dev/null; then
    print_error "Docker Compose не установлен. Пожалуйста, установите Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
  fi
}

# Запуск контейнеров
start_containers() {
  print_message "Запуск контейнеров..."
  docker compose up -d
  if [ $? -eq 0 ]; then
    print_success "Контейнеры успешно запущены"
    print_message "Клиент: http://localhost:3001"
    print_message "API: http://localhost:8080"
  else
    print_error "Ошибка при запуске контейнеров"
  fi
}

# Остановка контейнеров
stop_containers() {
  print_message "Остановка контейнеров..."
  docker compose down
  if [ $? -eq 0 ]; then
    print_success "Контейнеры остановлены"
  else
    print_error "Ошибка при остановке контейнеров"
  fi
}

# Пересборка контейнеров
rebuild_containers() {
  print_message "Пересборка контейнеров..."
  docker compose build --no-cache
  if [ $? -eq 0 ]; then
    start_containers
  else
    print_error "Ошибка при пересборке контейнеров"
  fi
}

# Просмотр логов
view_logs() {
  if [ -z "$1" ]; then
    print_message "Вывод логов всех сервисов (Нажмите Ctrl+C для выхода)..."
    docker compose logs -f
  else
    print_message "Вывод логов сервиса $1 (Нажмите Ctrl+C для выхода)..."
    docker compose logs -f "$1"
  fi
}

# Выполнение команды внутри контейнера
exec_command() {
  if [ -z "$1" ] || [ -z "$2" ]; then
    print_error "Не указан сервис или команда"
    echo "Использование: $0 exec <сервис> <команда>"
    exit 1
  fi
  
  print_message "Выполнение команды '$2' в контейнере '$1'..."
  docker compose exec "$1" $2
}

# Очистка всех данных (удаление томов)
clean_data() {
  print_warning "Это действие удалит все данные проекта (MongoDB и загруженные файлы)!"
  read -p "Вы уверены? (y/N): " confirm
  
  if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    print_message "Удаление контейнеров и томов..."
    docker compose down -v
    print_success "Контейнеры и тома удалены"
  else
    print_message "Операция отменена"
  fi
}

# Информация о запущенных контейнерах
container_info() {
  print_message "Информация о запущенных контейнерах:"
  docker compose ps
}

# Проверяем наличие Docker перед выполнением любой команды
check_docker

# Основное меню
case "$1" in
  start)
    start_containers
    ;;
  stop)
    stop_containers
    ;;
  restart)
    stop_containers
    start_containers
    ;;
  rebuild)
    rebuild_containers
    ;;
  logs)
    view_logs "$2"
    ;;
  exec)
    exec_command "$2" "$3"
    ;;
  clean)
    clean_data
    ;;
  info)
    container_info
    ;;
  *)
    echo "MERN Docker Utils - утилита для управления Docker-окружением"
    echo ""
    echo "Использование: $0 КОМАНДА [ОПЦИИ]"
    echo ""
    echo "Команды:"
    echo "  start               Запуск контейнеров"
    echo "  stop                Остановка контейнеров"
    echo "  restart             Перезапуск контейнеров"
    echo "  rebuild             Пересборка и запуск контейнеров"
    echo "  logs [сервис]       Просмотр логов (всех или указанного сервиса)"
    echo "  exec СЕРВИС КОМАНДА Выполнение команды внутри контейнера"
    echo "  clean               Удаление всех данных (MongoDB и загруженные файлы)"
    echo "  info                Информация о запущенных контейнерах"
    echo ""
    echo "Примеры:"
    echo "  $0 start            Запуск всех контейнеров"
    echo "  $0 logs server      Просмотр логов сервера"
    echo "  $0 exec server npm install bcrypt"
    echo "  $0 exec client sh   Запуск shell в контейнере клиента"
    exit 1
    ;;
esac

exit 0 