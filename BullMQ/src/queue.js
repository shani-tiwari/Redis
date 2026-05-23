import { Queue } from "bullmq";


const redisOptions = {      /*  redisOption/connection  */
    host: "localhost",
    port: 6379,
    // maxRetriesPerRequest: null,
};  


// const BANNER_QUEUE = "site-banner";  // queue name
// const bannerQueue = new Queue(BANNER_QUEUE, redisOptions);   /* Queue Name + Redis Option/Connection */


const email_queue = new Queue('email', { connection: redisOptions });

module.exports = {
    email_queue,
    redisOptions
};