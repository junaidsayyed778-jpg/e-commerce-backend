import amqp from "amqplib";



let channel;

export const connectRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);

    channel = await connection.createChannel();

    await channel.assertQueue(process.env.QUEUE_NAME,{
        durable: true,
    });
    console.log("Rabbit connected")
}

export const publishOrder = async (order) =>{
    if(!channel){
        throw new Error("RabbitMQ channel not initiallized")
    }

    channel.sendToQueue(
        Process.env.QUEUE_NAME,
        Buffer.from(JSON.stringify(order)),
        { persistent: true}
    );

    console.log("Order sent to queue")
}