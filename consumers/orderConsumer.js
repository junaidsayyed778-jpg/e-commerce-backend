import ampq from "amqplib";
import dotenv from "dotenv";

dotenv.config();

export const startOrderConsumer = async() =>{
    try{
        const connection = await ampq.connect(process.env.RABBITMQ_URI);
        const channel = await connection.createChannel();
        await channel.assertQueue(process.env.QUEUE_NAME, {durable: true});

        console.log("RabbitMQ consumer connected, waiting for messages...");

        channel.consume(
            process.env.QUEUE_NAME,
            (msg)=>{
                if(msg !== null){
                    const order = JSON.parse(msg.content.toString())
                    console.log("Processing order", order)
                }
            },
            {noAck: false}
        );

    }catch(error){
        console.log("failed to start RabbitMQ consumer:", error)
    }
}