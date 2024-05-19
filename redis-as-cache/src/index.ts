import express , {Request , Response} from 'express';
import { RedisClientType, createClient } from 'redis';

const app = express();
const PORT = 3000;

let redisClient : RedisClientType
async function connectToRedis() {
    try {
       redisClient = createClient();
       await redisClient.connect();

       console.log("Connected to local redis here");

    } catch (error) {
        console.log("error while connecting to redis" , error);
    }
}

connectToRedis();

app.use(express.json());

async function expensiveOperation() {
    await new Promise((resolve) => setTimeout(resolve , 1000));
    return {
        username : "tushar",
        email : "tushar@gmail.com"
    }
}

app.get('/uncached' , async (req: Request , res: Response) => {
    const data = await expensiveOperation();
    return res.status(201).json(data);
})

app.get('/cached' , async(req: Request , res: Response) => {
    const cachedData = await redisClient.get('data');
    if(cachedData){
        return res.status(201).json(cachedData);
    }

    const data = await expensiveOperation();
    await redisClient.set('data' , JSON.stringify(data));

    return res.status(201).json({
        data 
    });
})

app.listen(PORT , () => {
    console.log(`server is running on port ${PORT}`);
})