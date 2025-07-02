/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Channel, connect } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;
  private readonly queueName = 'messages_queue';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      const rabbitmqUrl = this.configService.get<string>('RABBITMQ');
      this.connection = await connect(rabbitmqUrl!);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
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
      return this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );
    } catch (error) {
      console.error('Failed to send message to queue', error);
      throw error;
    }
  }

  async consumeMessages(callback: (message: any) => Promise<void>) {
    try {
      await this.channel.consume(
        this.queueName,
        async (msg) => {
          if (msg) {
            const content = JSON.parse(msg.content.toString());
            await callback(content);
            this.channel.ack(msg);
          }
        },
        { noAck: false },
      );
    } catch (error) {
      console.error('Failed to consume messages', error);
      throw error;
    }
  }
}
