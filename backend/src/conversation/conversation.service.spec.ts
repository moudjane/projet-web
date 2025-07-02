import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ConversationService', () => {
  let service: ConversationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        {
          provide: PrismaService,
          useValue: {
            conversation: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createConversation', () => {
    it('should create a conversation and connect two users', async () => {
      const mockConversation = {
        id: 'convId',
        title: 'Test Conversation',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [
          { id: 'user1', username: 'user1', email: 'user1@example.com' },
          { id: 'user2', username: 'user2', email: 'user2@example.com' },
        ],
      };

      jest
        .spyOn(prisma.conversation, 'create')
        .mockResolvedValue(mockConversation);

      const result = await service.createConversation(
        'Test Conversation',
        'user1',
        'user2',
      );

      expect(result).toEqual(mockConversation);
      expect(prisma.conversation.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Conversation',
          users: {
            connect: [{ id: 'user1' }, { id: 'user2' }],
          },
        },
        include: { users: true },
      });
    });
  });

  describe('getUserConversations', () => {
    it('should return all conversations of a user', async () => {
      const mockConversations = [
        {
          id: 'conv1',
          title: 'Conversation 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          users: [
            { id: 'user1', username: 'user1', email: 'user1@example.com' },
          ],
        },
        {
          id: 'conv2',
          title: 'Conversation 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          users: [
            { id: 'user1', username: 'user1', email: 'user1@example.com' },
          ],
        },
      ];

      jest
        .spyOn(prisma.conversation, 'findMany')
        .mockResolvedValue(mockConversations);

      const result = await service.getUserConversations('user1');

      expect(result).toEqual(mockConversations);
      expect(prisma.conversation.findMany).toHaveBeenCalledWith({
        where: { users: { some: { id: 'user1' } } },
        include: { users: true },
      });
    });
  });
});
