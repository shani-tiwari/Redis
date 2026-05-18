import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

// ioredis Client
const redis = new Redis(
    // connect to docker compose redis container
    process.env.REDIS_URL || 'redis://localhost:6379'
);

// Testing Redis connection
redis.on('connect', () => {
    console.log('Connected to Redis!');  
});
redis.on('error', (err) => {
    console.error('Redis error:', err);
});


// API Endpoint - redis
app.get('/redis', async(req, res) => {
    try {
        const reply = await redis.ping();
        res.json({redis: reply});
    } catch (error) {
        res.status(500).json({ error: 'Redis error', details: error.message });
    }
});

// API Endpoint - mongoDB
app.get('/mongo', async(req, res) => {
    try {
        const url = process.env.MONGO_URI || 'mongodb://localhost:27017/redis';
        if(mongoose.connection.readyState === 0){
            await mongoose.connect(url);
            res.json({mongo: 'Connected to MongoDB!', database: mongoose.connection.name});
        }else{
            res.json({mongo: 'Already connected to MongoDB!', database: mongoose.connection.name});
        }
    } catch (error) {
        res.status(500).json({ error: 'MongoDB connection failed', details: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

