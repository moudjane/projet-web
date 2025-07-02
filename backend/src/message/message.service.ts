import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async sendMessage(content: string, userId: string, conversationId: string) {
    // Envoyer le message à la queue RabbitMQ au lieu de l'enregistrer directement
    const messagePayload = {
      content,
      userId,
      conversationId,
      timestamp: new Date().toISOString(),
    };

    await this.rabbitmqService.sendToQueue(messagePayload);

    // Retourner un objet temporaire avec les informations du message
    // Le message réel sera enregistré par le consumer
    return {
      id: 'pending',
      content,
      userId,
      conversationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: await this.prisma.user.findUnique({ where: { id: userId } }),
    };
  }

  async getMessagesByConversation(conversationId: string) {
    return await this.prisma.message.findMany({
      where: { conversationId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
