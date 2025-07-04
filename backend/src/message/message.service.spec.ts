import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

describe('MessageService', () => {
  let service: MessageService;
  let prisma: PrismaService;
  let rabbitmqService: RabbitmqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
            message: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: RabbitmqService,
          useValue: {
            sendToQueue: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    prisma = module.get<PrismaService>(PrismaService);
    rabbitmqService = module.get<RabbitmqService>(RabbitmqService);
  });

  describe('sendMessage', () => {
    it('should send a message to RabbitMQ queue', async () => {
      const user = {
        id: 'userId',
        username: 'user1',
        email: 'user1@example.com',
      };
      (rabbitmqService.sendToQueue as jest.Mock).mockResolvedValue(undefined);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await service.sendMessage(
        '***Test***',
        'userId',
        'convId',
      );

      expect(rabbitmqService.sendToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '***Test***',
          userId: 'userId',
          conversationId: 'convId',
        }),
      );
      expect(result).toMatchObject({
        id: 'pending',
        content: '***Test***',
        userId: 'userId',
        conversationId: 'convId',
        user,
      });
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getMessagesByConversation', () => {
    it('should return messages for a conversation', async () => {
      const messages = [
        {
          id: 'msg1',
          content: '***Test***',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: 'user1', username: 'user1' },
        },
      ];
      (prisma.message.findMany as jest.Mock).mockResolvedValue(messages);

      const result = await service.getMessagesByConversation('convId');

      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { conversationId: 'convId' },
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual(messages);
    });
  });
});
