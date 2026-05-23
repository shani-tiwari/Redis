import Redis from 'ioredis';

const subscriber = new Redis('redis://:localhost:6379');

subscriber.subscribe('notification', (err) => {
    if(err) {
        return console.log("Subscriber error: ", err)
    }
    console.log("Subscribed to channel: notification");
});

/* on message */
/* message - comes as String => if you want to convert into json then use JSON.parse() */
subscriber.on('message', (channel, message) => {
    const parsedMessage = JSON.parse(message);
    console.log(`Message received on channel ${channel}: `, parsedMessage);
});



/* Unsubscirbe after 10s */

setTimeout(() => {
    subscriber.unsubscribe('notification');
    console.log("Unsubscribed from channel: notification");
}, 10000);