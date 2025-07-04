import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { randomUUID } from 'crypto';

interface MessagePayload {
  content: string;
  userId: string;
  conversationId: string;
}

@Injectable()
export class MessageConsumer implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async onModuleInit() {
    await this.consumeMessages();
  }

  private async consumeMessages() {
    // Générer un identifiant unique pour cette instance du consumer
    const consumerId = randomUUID();

    await this.rabbitmqService.consumeMessages(
      async (message: MessagePayload) => {
        try {
          const { content, userId, conversationId } = message;

          // Sauvegarde du message dans la base de données
          const savedMessage = await this.prisma.message.create({
            data: {
              content,
              userId,
              conversationId,
            },
            include: {
              user: true,
            },
          });

          console.log(
            `Consumer ${consumerId}: Message saved to database: ${savedMessage.id}`,
          );
        } catch (error) {
          console.error(
            `Consumer ${consumerId}: Error processing message:`,
            error,
          );
        }
      },
      consumerId, // Passer l'identifiant unique au service RabbitMQ
    );

    console.log(`Message consumer started with ID: ${consumerId}`);
  }
}
