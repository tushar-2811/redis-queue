import { createClient } from "redis";

const client = createClient();

async function main() {
    try {
        await client.connect();
        console.log("connected to redis-> worker");
    } catch (error) {
        console.log("error while connecting to redis");
    }

    while(1){
        const response = await client.RPOP("submissions");
       console.log(response);
         
        // run the actual user code here
        await new Promise((resolve) => setTimeout(resolve , 2000));
        // send it to the pub sub

        console.log("processed user submission");
     }
      
}

main();