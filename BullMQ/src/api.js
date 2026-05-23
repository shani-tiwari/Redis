import { email_queue } from "./queue";
import express from "express";



const app = express();
app.use(express.json());



app.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

    /* 
    Queue Name : email
    Job name   : email
    Job Data   : { to, subject, text }
    */
    const job = await email_queue.add("send-email", 
        { to, subject, text },
    {
        attempts : 3,
        backoff : {
            delay : 1000,
            type : "exponential",
            maxDelay : 1000
        }
    });

    res.json({ message: "Email sent successfully", job });
});




app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

