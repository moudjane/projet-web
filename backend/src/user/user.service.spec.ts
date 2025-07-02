import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const users = [
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          password: 'hashed-password',
          isActive: true,
        },
        {
          id: '2',
          username: 'user2',
          email: 'user2@example.com',
          password: 'hashed-password',
          isActive: true,
        },
      ];

      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(users);

      const result = await service.getAllUsers();
      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
    });
  });

  describe('getUserById', () => {
    it('should return the user when found', async () => {
      const user = {
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        password: 'hashed-password',
        isActive: true,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

      const result = await service.getUserById('1');
      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      const result = await service.getUserById('id');
      expect(result).toBeNull();
    });
  });
});
