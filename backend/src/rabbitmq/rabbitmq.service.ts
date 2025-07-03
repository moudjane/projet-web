/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Channel, connect } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;
  private readonly queueName = 'messages_queue';
  private readonly exchangeName = 'messages_exchange';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      const rabbitmqUrl = this.configService.get<string>('RABBITMQ');
      this.connection = await connect(rabbitmqUrl!);
      this.channel = await this.connection.createChannel();

      // Déclarer l'échange de type fanout
      await this.channel.assertExchange(this.exchangeName, 'fanout', {
        durable: true,
      });

      // Déclarer la file d'attente
      await this.channel.assertQueue(this.queueName, { durable: true });

      // Lier la file d'attente à l'échange
      await this.channel.bindQueue(this.queueName, this.exchangeName, '');

      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('Disconnected from RabbitMQ');
    } catch (error) {
      console.error('Error closing RabbitMQ connection', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async sendToQueue(message: any) {
    try {
      // Publier le message sur l'échange au lieu de directement dans la file d'attente
      return this.channel.publish(
        this.exchangeName,
        '', // Routing key vide pour un échange fanout
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );
    } catch (error) {
      console.error('Failed to send message to queue', error);
      throw error;
    }
  }

  async consumeMessages(
    callback: (message: any) => Promise<void>,
    consumerIdentifier?: string,
  ) {
    try {
      // Créer une file d'attente exclusive pour chaque consommateur si un identifiant est fourni
      let queueToConsume = this.queueName;

      if (consumerIdentifier) {
        const { queue } = await this.channel.assertQueue(
          `${this.queueName}_${consumerIdentifier}`,
          {
            exclusive: true,
            autoDelete: true,
          },
        );
        await this.channel.bindQueue(queue, this.exchangeName, '');
        queueToConsume = queue;
        console.log(`Created exclusive queue: ${queueToConsume}`);
      }

      await this.channel.consume(
        queueToConsume,
        async (msg) => {
          if (msg) {
            const content = JSON.parse(msg.content.toString());
            await callback(content);
            this.channel.ack(msg);
          }
        },
        { noAck: false },
      );

      console.log(`Consumer started on queue: ${queueToConsume}`);
    } catch (error) {
      console.error('Failed to consume messages', error);
      throw error;
    }
  }
}
