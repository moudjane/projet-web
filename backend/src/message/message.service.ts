import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(content: string, userId: string, conversationId: string) {
    return await this.prisma.message.create({
      data: {
        content,
        userId,
        conversationId,
      },
      include: {
        user: true,
      },
    });
  }

  async getMessagesByConversation(conversationId: string) {
    return await this.prisma.message.findMany({
      where: { conversationId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
