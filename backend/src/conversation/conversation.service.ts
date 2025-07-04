import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(
    title: string,
    userId: string,
    targetUserId: string,
  ) {
    return await this.prisma.conversation.create({
      data: {
        title,
        users: {
          connect: [{ id: userId }, { id: targetUserId }],
        },
      },
      include: { users: true },
    });
  }

  async getUserConversations(userId: string) {
    return await this.prisma.conversation.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
      include: {
        users: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { user: true },
        },
      },
    });
  }

  //   async getAllConversations() {
  //     return await this.prisma.conversation.findMany({
  //       include: { users: true },
  //     });
  //   }
}
