import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

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

          console.log(`Message saved to database: ${savedMessage.id}`);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    );

    console.log('Message consumer started');
  }
}
