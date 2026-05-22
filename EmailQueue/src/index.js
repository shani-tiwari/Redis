import express from 'express'
import Redis from 'ioredis'

const app = express();
app.use(express.json());

const redis = new Redis('redis://localhost:6379');


const QUEUE_KEY = 'queue:emails';

app.post('/emails', async(req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'no subject',
        body: req.body.body || 'no content',
        createdAt: new Date().toISOString()
    };

    await redis.lpush(QUEUE_KEY, JSON.stringify(job)); /*   key -> value  |   pushing from left   |   storing as string in redis    */
    res.json({queued: true, job});
});


app.get('/emails/process-one', async(req,res) => {
    const rawJob = await redis.rpop(QUEUE_KEY);    /*   right pop                               */
    const job = JSON.parse(rawJob);                /*   parsing - converting string -> json     */
    res.json({ msg: 'email sent', job});
});


app.listen(3000, () => {
    console.log('server started');
})