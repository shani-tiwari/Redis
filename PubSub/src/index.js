/*  Pub(Publisher - API)     |    sub(Subscriber - App)  */

/* Publisher   - publish message with channel name as a topic name on redis PubSub channel  */
/* Subscribers - Active, Inactive  */
/* In Redis PubSub, subscribers are always active, if subscriber is offline while publishing message then it will not receive the message */

import express from "express";
import Redis from "ioredis";

const app = express();
const publisher = new Redis({
    host: 'localhost',
    port: 6379
});

app.use(express.json());


/* publish message to channel: notification  */
app.post("/notification", async (req, res) => {
    const { message } = req.body;
    
    /*  send data as an string always  */
    await publisher.publish("notification", JSON.stringify({ message }));

    res.json({ success: true });
});



app.listen(3000, () => {
    console.log("Server running on port 3000");
});