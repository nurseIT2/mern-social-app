require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const connectDB = require('./db'); // Подключаем БД один раз
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const { init } = require('./socket');

const app = express();

// Безопасный вывод MONGO_URI
const uri = process.env.MONGO_URI;
console.log('MONGO_URI:', uri ? uri.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@') : 'NOT SET');

// Подключаем БД
connectDB();

// Настройка хранения файлов
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const uniquePrefix = new Date().toISOString().replace(/:/g, '-');
        cb(null, uniquePrefix + '-' + file.originalname);
    }
});

// Фильтр файлов (разрешаем только изображения)
const fileFilter = (req, file, cb) => {
    cb(null, ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype));
};

// Middleware
app.use(bodyParser.json());
app.use(multer({ 
    storage: fileStorage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // ограничение в 5MB
}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors());

// Роуты
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// Добавляем маршрут health для проверки здоровья сервера
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Middleware обработки ошибок
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message, data: error.data });
});

// Запуск сервера после подключения к БД
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    const server = app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));

    const io = init(server);
    io.on('connection', socket => console.log('🔌 Client connected'));
});
