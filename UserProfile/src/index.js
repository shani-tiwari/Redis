import express from 'express'
import Redis from 'ioredis'

const app = express();
app.use(express.json());

const redis = new Redis('redis://localhost:6379');

/**saved data as json */
app.post('/user/:id/json', async(req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));  // key -> value
    res.json({ savedAs: 'json'});
});

app.get('/user/:id/json', async(req, res) => {
    const raw = await redis.get(`user:${req.params.id}:json`);  // key
    // return res.json({ data: JSON.parse(raw)});
    return res.json({ user: raw ? JSON.parse(raw) : 'No user' });
});


/** saved data as hash */
app.post('/user/:id/hash', async(req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({savedAs: "hash"})
});

app.get("/user/:id/hash", async(req, res) => {
    const user = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({user});
})


app.listen(3000, () => {
    console.log('server - 3000');
});

