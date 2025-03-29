const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('⚡️ Already connected to MongoDB');
            return;
        }

        // Попытка подключения с задержкой для ожидания готовности MongoDB
        console.log('Connecting to MongoDB:', process.env.MONGO_URI);
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true
        });

        console.log('✅ Connected to MongoDB!');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        // В Docker-среде лучше повторить попытку подключения через некоторое время
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;
