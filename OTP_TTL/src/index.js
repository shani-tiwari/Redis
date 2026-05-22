import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis('redis://localhost:6379');


function otpKey(phone){
    return `otp: ${phone}`;
}

app.post('/otp/send', async(req, res) => {
    const {phone} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);

    // got phone number and otp - set it on redis for 60 seconds
    await redis.set(otpKey(phone), otp, 'EX', 60);  // EX - expiry time
    return res.status(200).json({message: 'otp sent successfully', otp})
});

app.post('/otp/verify', async (req, res) => {
    // otp will be given as a string not number 
    const {phone, otp} = req.body;
    const storedOtp = await redis.get(otpKey(phone)); 

    if(!storedOtp){ return res.status(400).send({message: 'otp is expired or invalid'}); }
    if (storedOtp !== otp){ return res.status(400).send({message: 'otp is incorrect'}); }
    
    // if both are correct - delete the key
    await redis.del(otpKey(phone));
    
    return res.status(200).send({message: 'otp verified successfully'});
});

app.get('/otp/:phone/ttl',  async(req, res) => {
    const {phone} = req.params;
    const ttl = await redis.ttl(otpKey(phone));
    res.status(200).json({'ttl: ' : ttl});
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
