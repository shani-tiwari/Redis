import { Worker } from "bullmq";
import { redisOptions } from "./queue";


/* Queue Name    |    Job Processor(logic)    |  Redis Connection 
   "email"       |    async job => { ... }    |  redisOptions    */

const worker = new Worker('email', async (job) => {

    console.log(`Processing job ${job.id}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Job ${job.id} processed`)

}, { connection: redisOptions });


/*  Events to track job status  */

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, error) => {
    console.log(`Job ${job.id} failed: ${error.message}`);
});