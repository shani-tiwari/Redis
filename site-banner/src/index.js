import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const BANNER_KEY = 'site:banner';

app.post('/banner', async(req, res)=>{
    try {
        const message = req.body?.message || "welcome";
        await redis.set(BANNER_KEY, message); 
        return res.status(200).json({message:'Banner set successfully'});
    } catch (error) {
        return res.status(500).json({message:'Internal server error'});
    }
});


app.get('/banner',async (req,res)=>{
    try {
        const value = await redis.get(BANNER_KEY);
        return res.status(200).json({banner:value});
    } catch (error) {
        return res.status(500).json({message:'Internal server error'});
    }
});


app.delete('/banner/delete', async(req, res) => {
    try {
        await redis.del(BANNER_KEY);
        return res.json({success: true});
    } catch (error) {
        return res.status(500).json({message:'Internal server error'});
    }
});

// check - key exists in DB 
// any respond is done only if key exists
app.get('/banner/exist', async(req, res) => {
    try {
        const exists = await redis.exists(BANNER_KEY);
        return res.json({exists: Boolean(exists)});
    } catch (error) {
        return res.status(500).json({message:'Internal server error'});
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
