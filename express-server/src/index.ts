import express, {Request, Response } from 'express'
import { createClient } from 'redis';

const port = 8000;

const app = express();
app.use(express.json());
const client = createClient();

async function clientConnect() {
    await client.connect();
    console.log("connected to redis");
}
clientConnect();


app.post('/submit' , async (req:Request , res: Response) => {
    try {

        const {problemId , userId , code , language } = req.body;

        // push this to database postgres
        
       await client.lPush("submissions" , JSON.stringify({problemId , userId , code , language}));

        return res.status(200).json({
            success : true,
            message : "submission recieved" 
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success : false,
            error : error
        })
    }
})




app.listen(port , () => {
    console.log(`server is listening on port : ${port}`);
})